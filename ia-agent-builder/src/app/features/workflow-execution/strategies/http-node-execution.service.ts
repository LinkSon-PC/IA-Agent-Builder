import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NodeType } from '../../../core/models/node-type';
import { QuestionWorkflowNode } from '../../../core/models/workflow-node';
import { NodeExecutionStrategy } from '../node-execution-strategy';

/**
 * Example execution strategy that calls an external HTTP API.
 */
@Injectable({ providedIn: 'root' })
export class HttpNodeExecutionService implements NodeExecutionStrategy<QuestionWorkflowNode> {
  readonly type = NodeType.Question;

  constructor(private readonly http: HttpClient) {}

  async execute(node: QuestionWorkflowNode, inputData: unknown): Promise<unknown> {
    const url = 'https://httpbin.org/post';
    const payload = {
      prompt: node.config.prompt,
      variableName: node.config.variableName,
      inputData
    };

    return firstValueFrom(this.http.post<unknown>(url, payload));
  }
}
