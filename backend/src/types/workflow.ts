export interface WorkflowTree {
  id: string;
  name: string;
  startNodeId: string;
  root: WorkflowNode;
}

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  status: 'enabled' | 'disabled';
  config: Record<string, unknown>;
  children: WorkflowNode[];
}