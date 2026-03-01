import { Injectable, inject } from '@angular/core';
import { NodeState } from '../../core/models/node-state';
import { WorkflowConnection } from '../../core/models/workflow-connection';
import { AnyWorkflowNode } from '../../core/models/workflow-node';
import { WorkflowStoreService } from '../workflow/store/workflow-store.service';
import { NodeExecutionRegistryService } from './node-execution-registry.service';

/**
 * Executes a workflow pipeline sequentially.
 *
 * Notes:
 * - Execution is linear for now: only the first outgoing connection is followed.
 * - When a node has no successor, execution completes without error.
 * - Engine never touches UI; it only updates store state.
 */
@Injectable({ providedIn: 'root' })
export class WorkflowExecutionEngineService {
  private readonly store = inject(WorkflowStoreService);
  private readonly registry = inject(NodeExecutionRegistryService);

  /**
   * Executes a pipeline starting at a given node id.
   *
   * @param startNodeId Entry node id.
   */
  async executePipeline(startNodeId: string): Promise<void> {
    const wf = this.store.activeWorkflow();
    if (!wf) return;

    const nodesById = new Map<string, AnyWorkflowNode>(wf.nodes.map((n) => [n.id, n]));
    const outgoingByNodeId = this.buildOutgoingIndex(wf.connections);

    let currentNodeId: string | undefined = startNodeId;
    let inputData: unknown = null;

    while (currentNodeId) {
      const node = nodesById.get(currentNodeId);
      if (!node) return;

      const strategy = this.registry.get(node.type);
      if (!strategy) {
        this.store.setNodeState(node.id, 'error');
        return;
      }

      if (node.status === 'disabled') {
        // Builder-disabled nodes are currently treated as terminal error.
        this.store.setNodeState(node.id, 'error');
        return;
      }

      try {
        this.store.setNodeState(node.id, 'running');

        const output = await strategy.execute(node, inputData);

        this.store.setNodeState(node.id, 'success');

        const nextNodeId = this.getNextNodeId(node.id, outgoingByNodeId);
        if (!nextNodeId) {
          return;
        }

        inputData = output;
        currentNodeId = nextNodeId;
      } catch {
        this.store.setNodeState(node.id, 'error');
        return;
      }
    }
  }

  private buildOutgoingIndex(connections: WorkflowConnection[]): ReadonlyMap<string, WorkflowConnection[]> {
    const index = new Map<string, WorkflowConnection[]>();
    for (const c of connections) {
      const list = index.get(c.fromNodeId) ?? [];
      index.set(c.fromNodeId, [...list, c]);
    }
    return index;
  }

  private getNextNodeId(
    fromNodeId: string,
    outgoingIndex: ReadonlyMap<string, WorkflowConnection[]>
  ): string | undefined {
    const outgoing = outgoingIndex.get(fromNodeId) ?? [];
    if (outgoing.length === 0) return undefined;
    return outgoing[0].toNodeId;
  }
}
