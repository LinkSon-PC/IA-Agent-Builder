import faqRaw from '../data/faq.json';

const faqData = faqRaw as any[];

export async function runFaqAgent(query: string) {
  const matches = faqData.filter((item: any) =>
    query.toLowerCase().includes(item.question.toLowerCase())
  );

  if (matches.length > 0) {
    return matches[0].answer;
  }

  return null;
}