import { faqTool } from '../tools/faqTool.js';
export async function runFaqAgent(query) {
    return await faqTool(query);
}
