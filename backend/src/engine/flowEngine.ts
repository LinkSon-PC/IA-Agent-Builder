import { WorkflowTree, WorkflowNode } from '../types/workflow.js';
import { Orchestrator } from '../agents/orchestrator.js';

export class FlowEngine {

  private orchestrator = new Orchestrator();

  async execute(workflow: WorkflowTree, query: string): Promise<unknown> {
    if (!workflow.root) {
      throw new Error('Workflow root missing');
    }

    return await this.executeNode(workflow.root, query);
  }

  private async executeNode(node: WorkflowNode, query: string): Promise<unknown> {

    if (node.status !== 'enabled') {
      return null;
    }

    switch (node.type) {

      case 'coordinator':
        return await this.orchestrator.handleCoordinator(node, query);

      case 'agent-route-final':
        return await this.orchestrator.routeToAgent(
          node.config.route as string,
          query
        );

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}