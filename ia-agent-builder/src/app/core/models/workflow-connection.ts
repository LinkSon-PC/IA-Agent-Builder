/**
 * Connection edge between two workflow nodes.
 */
export interface WorkflowConnection {
  /** Source node id. */
  fromNodeId: string;

  /** Target node id. */
  toNodeId: string;
}
