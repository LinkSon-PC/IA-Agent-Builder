import { runOrchestrator } from './agents/orchestrator';

export async function runFlow(flow: any, userInput: string) {
  const state: Record<string, any> = {};

  for (const node of flow.nodes) {
    switch (node.type) {
      case 'input':
        state[node.id] = userInput;
        break;

      case 'prompt':
        state[node.id] = await runOrchestrator(userInput);
        break;

      case 'output':
        return state[node.config.sourceNodeId];

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  return null;
}