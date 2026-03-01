import autosRaw from '../data/autos.json';

const autosData = autosRaw as any[];

export async function runCatalogAgent(query: string) {
  const matches = autosData.filter((auto: any) =>
    query.toLowerCase().includes(auto.model.toLowerCase())
  );

  if (matches.length > 0) {
    return `Tenemos disponible el modelo ${matches[0].model} por ${matches[0].price}`;
  }

  return null;
}