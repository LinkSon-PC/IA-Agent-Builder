import { NodeType } from '../../../core/models/node-type';
import { MessageWorkflowNode } from '../../../core/models/workflow-node';
import { NodeStrategy } from '../../../core/services/node-registry.service';

/**
 * Domain strategy for Message nodes (defaults + validation).
 */
export class MessageWorkflowNodeStrategy implements NodeStrategy<MessageWorkflowNode, { text: string }> {
  readonly type = NodeType.Message;

  getDefaultConfig(): { text: string } {
    return { text: 'Hola' };
  }

  validate(node: MessageWorkflowNode): readonly string[] {
    const errors: string[] = [];
    if (!node.config.text.trim()) {
      errors.push('El texto es requerido.');
    }
    return errors;
  }
}
