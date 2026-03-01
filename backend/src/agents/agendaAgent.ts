import { agendaTool } from '../tools/agendaTool.js';

export async function runAgendaAgent(query: string): Promise<string> {
  return await agendaTool(query);
}