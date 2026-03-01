import autosData from "../data/autos.json" with { type: "json" };

interface Vehicle {
  Marca: string;
  Modelo: string;
  Año: number;
  Kilometraje: number;
  Color: string;
  Descripción: string;
  Puertas: number;
  Segmento: string;
  Precio: number;
  Estado: string;
  Ciudad: string;
  "Tipo de combustible": string;
  Motor: number;
  Transmisión: string;
  URL: string;
  Cantidad: number;
}

interface AutosData {
  available_vehicles: Vehicle[];
}

const data = autosData as unknown as AutosData;

export async function catalogTool(query: string): Promise<string> {
  const q = query.toLowerCase();

  const results = data.available_vehicles.filter((vehicle) =>
    vehicle.Marca.toLowerCase().includes(q) ||
    vehicle.Modelo.toLowerCase().includes(q) ||
    vehicle.Segmento.toLowerCase().includes(q) ||
    vehicle.Ciudad.toLowerCase().includes(q) ||
    vehicle.Estado.toLowerCase().includes(q)
  );

  if (results.length === 0) {
    return "No encontré vehículos que coincidan con tu búsqueda.";
  }

  const vehicle = results[0];

  return `
Te recomiendo el ${vehicle.Marca} ${vehicle.Modelo} ${vehicle.Año}.
📍 Ubicación: ${vehicle.Ciudad}, ${vehicle.Estado}
💰 Precio: $${vehicle.Precio.toLocaleString()}
⛽ Combustible: ${vehicle["Tipo de combustible"]}
⚙️ Transmisión: ${vehicle.Transmisión}
📝 Descripción: ${vehicle.Descripción}
`;
}