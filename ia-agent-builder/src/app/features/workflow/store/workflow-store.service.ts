import { Injectable, computed, signal } from '@angular/core';
import { NodeState } from '../../../core/models/node-state';
import { NodeStatus } from '../../../core/models/node-status';
import { Workflow } from '../../../core/models/workflow';
import { WorkflowConnection } from '../../../core/models/workflow-connection';
import { AnyWorkflowNode } from '../../../core/models/workflow-node';

export type WorkflowMode = 'edit' | 'simulate';

/**
 * Central workflow state store using Angular Signals.
 */
@Injectable({ providedIn: 'root' })
export class WorkflowStoreService {
  private readonly _activeWorkflow = signal<Workflow | null>(null);
  private readonly _selectedNodeId = signal<string | null>(null);
  private readonly _mode = signal<WorkflowMode>('edit');

  /** Currently active workflow in the editor. */
  readonly activeWorkflow = this._activeWorkflow.asReadonly();

  /** Selected node id on the canvas. */
  readonly selectedNodeId = this._selectedNodeId.asReadonly();

  /** Editor mode. */
  readonly mode = this._mode.asReadonly();

  /** Derived nodes. */
  readonly nodes = computed<AnyWorkflowNode[]>(() => this.activeWorkflow()?.nodes ?? []);

  /** Derived connections. */
  readonly connections = computed<WorkflowConnection[]>(() => this.activeWorkflow()?.connections ?? []);

  /**
   * Currently selected node (resolved from the active workflow and selected node id).
   */
  readonly selectedNode = computed<AnyWorkflowNode | null>(() => {
    const wf = this.activeWorkflow();
    const id = this.selectedNodeId();
    if (!wf || !id) return null;
    return wf.nodes.find((n) => n.id === id) ?? null;
  });

  /** Sets the active workflow and clears the current selection. */
  setActiveWorkflow(workflow: Workflow | null): void {
    this._activeWorkflow.set(workflow);
    this._selectedNodeId.set(null);
  }

  /** Selects a node by id. */
  selectNode(nodeId: string | null): void {
    this._selectedNodeId.set(nodeId);
  }

  /**
   * Updates a node editable status (enabled/disabled) and bumps workflow updatedAt.
   */
  updateNodeStatus(nodeId: string, status: NodeStatus): void {
    const wf = this.activeWorkflow();
    if (!wf) return;

    const nodes = wf.nodes.map((n) => (n.id === nodeId ? { ...n, status } : n));
    this._activeWorkflow.set({
      ...wf,
      nodes,
      updatedAtIso: new Date().toISOString()
    });
  }

  /** Updates the runtime state of a node and bumps workflow updatedAt. */
  setNodeState(nodeId: string, state: NodeState): void {
    const wf = this.activeWorkflow();
    if (!wf) return;

    const nodes = wf.nodes.map((n) => (n.id === nodeId ? { ...n, state } : n));
    this._activeWorkflow.set({
      ...wf,
      nodes,
      updatedAtIso: new Date().toISOString()
    });
  }

  /** Updates a node config data and bumps workflow updatedAt. */
  updateNodeData(nodeId: string, config: unknown): void {
    const wf = this.activeWorkflow();
    if (!wf) return;

    const nodes = wf.nodes.map((n) => (n.id === nodeId ? { ...n, config: config as never } : n));
    this._activeWorkflow.set({
      ...wf,
      nodes,
      updatedAtIso: new Date().toISOString()
    });
  }

  /** Replaces node list. */
  setNodes(nodes: AnyWorkflowNode[]): void {
    const wf = this.activeWorkflow();
    if (!wf) return;

    this._activeWorkflow.set({
      ...wf,
      nodes,
      updatedAtIso: new Date().toISOString()
    });
  }

  /** Replaces connection list. */
  setConnections(connections: WorkflowConnection[]): void {
    const wf = this.activeWorkflow();
    if (!wf) return;

    this._activeWorkflow.set({
      ...wf,
      connections,
      updatedAtIso: new Date().toISOString()
    });
  }

  /** Adds a new connection edge. */
  addConnection(connection: WorkflowConnection): void {
    const wf = this.activeWorkflow();
    if (!wf) return;

    const connections: WorkflowConnection[] = [...wf.connections, connection];
    this._activeWorkflow.set({
      ...wf,
      connections,
      updatedAtIso: new Date().toISOString()
    });
  }

  /** Removes a connection edge (if present). */
  removeConnection(fromNodeId: string, toNodeId: string): void {
    const wf = this.activeWorkflow();
    if (!wf) return;

    const connections = wf.connections.filter(
      (c) => !(c.fromNodeId === fromNodeId && c.toNodeId === toNodeId)
    );
    this._activeWorkflow.set({
      ...wf,
      connections,
      updatedAtIso: new Date().toISOString()
    });
  }

  /** Removes all connections that reference a given node id. */
  removeConnectionsForNode(nodeId: string): void {
    const wf = this.activeWorkflow();
    if (!wf) return;

    const connections = wf.connections.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId);
    this._activeWorkflow.set({
      ...wf,
      connections,
      updatedAtIso: new Date().toISOString()
    });
  }
}
