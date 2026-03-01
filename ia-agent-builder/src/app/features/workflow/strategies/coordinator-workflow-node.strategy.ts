import { NodeType } from '../../../core/models/node-type';
import { CoordinatorWorkflowNode } from '../../../core/models/workflow-node';
import { NodeStrategy } from '../../../core/services/node-registry.service';

/**
 * Domain strategy for Coordinator nodes (defaults + validation).
 */
export class CoordinatorWorkflowNodeStrategy
  implements NodeStrategy<CoordinatorWorkflowNode, { basePrompt: string }>
{
  readonly type = NodeType.Coordinator;

  getDefaultConfig(): { basePrompt: string } {
    return { basePrompt: 'Eres un coordinador de agentes...' };
  }

  validate(node: CoordinatorWorkflowNode): readonly string[] {
    const errors: string[] = [];
    if (!node.config.basePrompt.trim()) errors.push('El base prompt es requerido.');
    return errors;
  }
}
