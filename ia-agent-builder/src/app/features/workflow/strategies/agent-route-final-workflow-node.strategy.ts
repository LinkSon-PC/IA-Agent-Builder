import { NodeType } from '../../../core/models/node-type';
import { AgentRouteFinalWorkflowNode } from '../../../core/models/workflow-node';
import { NodeStrategy } from '../../../core/services/node-registry.service';

export class AgentRouteFinalWorkflowNodeStrategy
  implements NodeStrategy<AgentRouteFinalWorkflowNode, { route: string }>
{
  readonly type = NodeType.AgentRouteFinal;

  getDefaultConfig(): { route: string } {
    return { route: '' };
  }

  validate(_: AgentRouteFinalWorkflowNode): readonly string[] {
    return [];
  }
}
