import { NodeType } from '../../../core/models/node-type';
import { QuestionWorkflowNode } from '../../../core/models/workflow-node';
import { NodeStrategy } from '../../../core/services/node-registry.service';

/**
 * Domain strategy for Question nodes (defaults + validation).
 */
export class QuestionWorkflowNodeStrategy
  implements NodeStrategy<QuestionWorkflowNode, { prompt: string; variableName: string }>
{
  readonly type = NodeType.Question;

  getDefaultConfig(): { prompt: string; variableName: string } {
    return { prompt: '¿Cuál es tu nombre?', variableName: 'userName' };
  }

  validate(node: QuestionWorkflowNode): readonly string[] {
    const errors: string[] = [];
    if (!node.config.prompt.trim()) errors.push('El prompt es requerido.');
    if (!node.config.variableName.trim()) errors.push('El nombre de variable es requerido.');
    return errors;
  }
}
