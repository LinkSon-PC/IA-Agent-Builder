import { WorkflowConnection } from './workflow-connection';
import { AnyWorkflowNode } from './workflow-node';

/**
 * Root aggregate for a workflow (nodes + directed connections).
 */
export interface Workflow {
  /** Workflow id. */
  id: string;

  /** Display name. */
  name: string;

  /** ISO timestamp for creation. */
  createdAtIso: string;

  /** ISO timestamp for last update. */
  updatedAtIso: string;

  /** Entry point node id (pipeline start). */
  startNodeId: string;

  /** Node list. */
  nodes: AnyWorkflowNode[];

  /** Directed edges between nodes. */
  connections: WorkflowConnection[];
}
