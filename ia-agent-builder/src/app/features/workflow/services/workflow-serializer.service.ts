import { Injectable } from '@angular/core';
import { NodeType } from '../../../core/models/node-type';
import { Workflow } from '../../../core/models/workflow';
import { WorkflowConnection } from '../../../core/models/workflow-connection';
import { AnyWorkflowNode } from '../../../core/models/workflow-node';

export interface SerializedWorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  status: 'enabled' | 'disabled';
  config: unknown;
  next: string[];
}

export interface SerializedWorkflow {
  id: string;
  name: string;
  startNodeId: string;
  nodes: SerializedWorkflowNode[];
}

export interface SerializedWorkflowTreeNode {
  id: string;
  type: NodeType;
  name: string;
  status: 'enabled' | 'disabled';
  config: unknown;
  children: SerializedWorkflowTreeNode[];
  ref?: true;
}

export interface SerializedWorkflowTree {
  id: string;
  name: string;
  startNodeId: string;
  root: SerializedWorkflowTreeNode | null;
}

@Injectable({ providedIn: 'root' })
export class WorkflowSerializerService {
  /**
   * Serializes the workflow into a compact structure suitable for persistence or API calls.
   *
   * - Each node includes its form config (`config`).
   * - Each node includes `next` as an array of node ids, supporting multiple outgoing connections.
   */
  serialize(workflow: Workflow): SerializedWorkflow {
    const outgoingIndex = this.buildOutgoingIndex(workflow.connections);

    const nodes: SerializedWorkflowNode[] = workflow.nodes.map((n: AnyWorkflowNode) => {
      const outgoing = outgoingIndex.get(n.id) ?? [];
      const next = outgoing.map((c) => c.toNodeId);

      return {
        id: n.id,
        type: n.type,
        name: n.name,
        status: n.status,
        config: n.config,
        next
      };
    });

    return {
      id: workflow.id,
      name: workflow.name,
      startNodeId: workflow.startNodeId,
      nodes
    };
  }

  /**
   * Produces an adjacency object keyed by node id.
   * Useful if you prefer `{ [nodeId]: { config, next: [...] } }`.
   */
  toAdjacencyMap(workflow: Workflow): Record<string, Omit<SerializedWorkflowNode, 'id'>> {
    const serialized = this.serialize(workflow);
    const map: Record<string, Omit<SerializedWorkflowNode, 'id'>> = {};

    for (const n of serialized.nodes) {
      map[n.id] = {
        type: n.type,
        name: n.name,
        status: n.status,
        config: n.config,
        next: n.next
      };
    }

    return map;
  }

  serializeTree(workflow: Workflow): SerializedWorkflowTree {
    const nodesById = new Map<string, AnyWorkflowNode>(workflow.nodes.map((n) => [n.id, n]));
    const outgoingIndex = this.buildOutgoingIndex(workflow.connections);
    const visited = new Set<string>();

    const build = (nodeId: string): SerializedWorkflowTreeNode | null => {
      const node = nodesById.get(nodeId);
      if (!node) return null;

      if (visited.has(nodeId)) {
        return {
          id: node.id,
          type: node.type,
          name: node.name,
          status: node.status,
          config: node.config,
          children: [],
          ref: true
        };
      }

      visited.add(nodeId);

      const outgoing = outgoingIndex.get(nodeId) ?? [];
      const children = outgoing
        .map((c) => build(c.toNodeId))
        .filter((c): c is SerializedWorkflowTreeNode => !!c);

      return {
        id: node.id,
        type: node.type,
        name: node.name,
        status: node.status,
        config: node.config,
        children
      };
    };

    const root = workflow.startNodeId ? build(workflow.startNodeId) : null;

    return {
      id: workflow.id,
      name: workflow.name,
      startNodeId: workflow.startNodeId,
      root
    };
  }

  private buildOutgoingIndex(connections: WorkflowConnection[]): ReadonlyMap<string, WorkflowConnection[]> {
    const index = new Map<string, WorkflowConnection[]>();
    for (const c of connections) {
      const list = index.get(c.fromNodeId) ?? [];
      index.set(c.fromNodeId, [...list, c]);
    }
    return index;
  }
}
