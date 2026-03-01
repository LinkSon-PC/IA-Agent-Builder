import { Injectable } from '@angular/core';
import { NodeType } from '../../../core/models/node-type';
import { MessageWorkflowNode } from '../../../core/models/workflow-node';
import { NodeExecutionStrategy } from '../node-execution-strategy';

/**
 * Example execution strategy that transforms input data into a message output.
 */
@Injectable({ providedIn: 'root' })
export class TransformNodeExecutionService implements NodeExecutionStrategy<MessageWorkflowNode> {
  readonly type = NodeType.Message;

  async execute(node: MessageWorkflowNode, inputData: unknown): Promise<unknown> {
    const prefix = typeof inputData === 'string' && inputData.trim() ? `${inputData}\n` : '';
    return `${prefix}${node.config.text}`;
  }
}
