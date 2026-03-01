import { ai } from '../genkit';

export async function runPromptNode(
  promptTemplate: string,
  state: Record<string, any>
) {
  const compiledPrompt = promptTemplate.replace(
    '{{input}}',
    Object.values(state)[0] || ''
  );

  const response = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: compiledPrompt,
  });

  return response.text;
}