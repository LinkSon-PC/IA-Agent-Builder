import { ai } from '../genkit.js';
import { classifyPrompt } from '../prompts/classifyPrompt.js';
import { faqTool } from '../tools/faqTool.js';
import { catalogTool } from '../tools/catalogTool.js';
import { agendaTool } from '../tools/agendaTool.js';
export async function runOrchestrator(query) {
    const classification = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `${classifyPrompt}\nUsuario: ${query}`
    });
    const intent = classification.text.trim().toUpperCase();
    console.log("Intent detectado:", intent);
    if (intent === 'CATALOGO') {
        return await catalogTool(query);
    }
    if (intent === 'AGENDA') {
        return await agendaTool(query);
    }
    return await faqTool(query);
}
