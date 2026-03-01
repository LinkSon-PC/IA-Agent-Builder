import autosData from "../data/autos.json" with { type: "json" };
const data = autosData;
export async function catalogTool(query) {
    const q = query.toLowerCase();
    const results = data.available_vehicles.filter((vehicle) => vehicle.Marca.toLowerCase().includes(q) ||
        vehicle.Modelo.toLowerCase().includes(q) ||
        vehicle.Segmento.toLowerCase().includes(q) ||
        vehicle.Ciudad.toLowerCase().includes(q) ||
        vehicle.Estado.toLowerCase().includes(q));
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
