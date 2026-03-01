import { faqTool } from '../tools/faqTool.js';

export async function runFaqAgent(query: string): Promise<string> {
  return await faqTool(query);
}