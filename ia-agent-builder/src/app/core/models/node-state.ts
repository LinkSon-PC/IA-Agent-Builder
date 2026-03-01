/**
 * Runtime/execution state of a node.
 *
 * This is updated by the execution engine.
 */
export type NodeState = 'idle' | 'running' | 'success' | 'error';
