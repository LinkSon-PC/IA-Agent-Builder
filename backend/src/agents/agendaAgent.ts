import datesRaw from '../data/dates.json';

const datesData = datesRaw as any[];

export async function runAgendaAgent(query: string) {
  return `Tenemos disponibilidad el ${datesData[0].date} a las ${datesData[0].time}`;
}