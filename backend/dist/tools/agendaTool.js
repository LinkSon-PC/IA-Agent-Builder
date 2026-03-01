import datesData from '../data/dates.json' with { type: 'json' };
const dates = datesData;
export async function agendaTool(query) {
    const firstAvailable = dates.find(d => d.slots?.length > 0);
    if (!firstAvailable)
        return 'No hay horarios disponibles.';
    return `Tenemos disponibilidad el ${firstAvailable.fecha} a las ${firstAvailable.slots[0]}.`;
}
