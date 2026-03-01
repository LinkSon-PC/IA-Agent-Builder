import faqData from '../data/faq.json' with { type: 'json' };
const data = faqData;
export async function faqTool(query) {
    const q = query.toLowerCase();
    for (const cat of data.faq_agencia_autos) {
        for (const p of cat.preguntas) {
            if (p.pregunta.toLowerCase().includes(q))
                return p.respuesta;
        }
    }
    return 'No encontré información relacionada en nuestras preguntas frecuentes.';
}
