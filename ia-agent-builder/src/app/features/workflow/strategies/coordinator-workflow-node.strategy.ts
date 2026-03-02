import { NodeType } from '../../../core/models/node-type';
import { CoordinatorWorkflowNode } from '../../../core/models/workflow-node';
import { NodeStrategy } from '../../../core/services/node-registry.service';

/**
 * Domain strategy for Coordinator nodes (defaults + validation).
 */
export class CoordinatorWorkflowNodeStrategy
  implements NodeStrategy<CoordinatorWorkflowNode, { agentName: string; basePrompt: string }>
{
  readonly type = NodeType.Coordinator;

  getDefaultConfig(): { agentName: string; basePrompt: string } {
    return { agentName: '', basePrompt: 'Eres un coordinador de agentes...' };
  }

  validate(node: CoordinatorWorkflowNode): readonly string[] {
    const errors: string[] = [];
    if (!node.config.agentName.trim()) errors.push('El nombre del agente es requerido.');
    if (!node.config.basePrompt.trim()) errors.push('El base prompt es requerido.');
    return errors;
  }
}
