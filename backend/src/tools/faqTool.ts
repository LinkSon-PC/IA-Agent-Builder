import faqData from '../data/faq.json' with { type: 'json' };

interface Pregunta {
  id: number;
  pregunta: string;
  respuesta: string;
}
interface Categoria {
  categoria: string;
  preguntas: Pregunta[];
}
interface FAQData {
  faq_agencia_autos: Categoria[];
}

const data: FAQData = faqData;

export async function faqTool(query: string): Promise<string> {
  const q = query.toLowerCase();

  for (const cat of data.faq_agencia_autos) {
    for (const p of cat.preguntas) {
      if (p.pregunta.toLowerCase().includes(q)) return p.respuesta;
    }
  }

  return 'No encontré información relacionada en nuestras preguntas frecuentes.';
}