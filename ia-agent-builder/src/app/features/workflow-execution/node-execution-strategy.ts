import { AnyWorkflowNode } from '../../core/models/workflow-node';

/**
 * Execution strategy contract for a workflow node type.
 *
 * The engine stays closed for modification; new node types can be added by registering
 * additional strategies in {@link NodeExecutionRegistryService}.
 */
export interface NodeExecutionStrategy<TNode extends AnyWorkflowNode = AnyWorkflowNode> {
  /** Discriminator for which node type this strategy supports. */
  readonly type: TNode['type'];

  /**
   * Executes a single node.
   *
   * @param node Node to execute.
   * @param inputData Data produced by the previous node (or null for the first node).
   * @returns Output data to be passed to the next node.
   */
  execute(node: TNode, inputData: unknown): Promise<unknown>;
}
