import { catalogTool } from '../tools/catalogTool.js';

export async function runCatalogAgent(query: string): Promise<string> {
  return await catalogTool(query);
}