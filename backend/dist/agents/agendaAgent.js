import { agendaTool } from '../tools/agendaTool.js';
export async function runAgendaAgent(query) {
    return await agendaTool(query);
}
