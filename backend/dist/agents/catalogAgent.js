import { catalogTool } from '../tools/catalogTool.js';
export async function runCatalogAgent(query) {
    return await catalogTool(query);
}
