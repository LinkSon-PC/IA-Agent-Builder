import { WorkflowNode } from '../types/workflow.js';
import { runAgendaAgent } from './agendaAgent.js';
import { runCatalogAgent } from './catalogAgent.js';
import { runFaqAgent } from './faqAgent.js';

export class Orchestrator {

  async handleCoordinator(node: WorkflowNode, query: string): Promise<unknown> {

    for (const child of node.children) {
      if (child.status !== 'enabled') continue;

      const result = await this.routeToAgent(
        child.config.route as string,
        query
      );

      if (result) {
        return result;
      }
    }

    return null;
  }

  async routeToAgent(route: string, query: string): Promise<unknown> {

    switch (route) {

      case 'agendaAgent':
        return await runAgendaAgent(query);

      case 'catalogAgent':
        return await runCatalogAgent(query);

      case 'faqAgent':
        return await runFaqAgent(query);

      default:
        throw new Error(`Unknown agent route: ${route}`);
    }
  }
}