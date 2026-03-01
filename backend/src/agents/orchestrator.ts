import { runFaqAgent } from './faqAgent';
import { runCatalogAgent } from './catalogAgent';
import { runAgendaAgent } from './agendaAgent';

export async function runOrchestrator(query: string) {

  // Lógica simple de routing
  if (query.toLowerCase().includes('precio') || query.toLowerCase().includes('modelo')) {
    return await runCatalogAgent(query);
  }

  if (query.toLowerCase().includes('cita') || query.toLowerCase().includes('agenda')) {
    return await runAgendaAgent(query);
  }

  return await runFaqAgent(query);
}