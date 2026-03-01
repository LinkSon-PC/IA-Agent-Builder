import datesData from '../data/dates.json' with { type: 'json' };

interface AgendaDay {
  fecha: string;
  slots: string[];
}

const dates: AgendaDay[] = datesData;

export async function agendaTool(query: string): Promise<string> {
  const firstAvailable = dates.find(d => d.slots?.length > 0);

  if (!firstAvailable) return 'No hay horarios disponibles.';

  return `Tenemos disponibilidad el ${firstAvailable.fecha} a las ${firstAvailable.slots[0]}.`;
}