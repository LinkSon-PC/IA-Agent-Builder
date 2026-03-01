import { ai } from "../genkit.js";
import { classifyPrompt } from "../prompts/classifyPrompt.js";

import { runFaqAgent } from "../agents/faqAgent.js";
import { runCatalogAgent } from "../agents/catalogAgent.js";
import { runAgendaAgent } from "../agents/agendaAgent.js";

type AgentType = "FAQ" | "CATALOGO" | "AGENDA";

type Node = {
  id: string;
  type: "orchestrator" | "agent";
  agent?: AgentType;
  children?: string[];
};

export type FlowDefinition = {
  flowId: string;
  nodes: Node[];
};

type SessionState = {
  currentNode: string;
  memory: { role: "user" | "assistant"; content: string }[];
};

const sessions = new Map<string, SessionState>();

export class FlowEngine {
  constructor(private flow: FlowDefinition) {}

  private getNode(nodeId: string): Node | undefined {
    return this.flow.nodes.find((n) => n.id === nodeId);
  }

  async execute(sessionId: string, input: string): Promise<string> {
    let session = sessions.get(sessionId);

    if (!session) {
      session = {
        currentNode: "orchestrator",
        memory: [],
      };
      sessions.set(sessionId, session);
    }

    session.memory.push({ role: "user", content: input });

    const node = this.getNode(session.currentNode);
    if (!node) throw new Error("Nodo inválido");

    if (node.type === "orchestrator") {
      const nextNodeId = await this.route(input, node.children || []);
      session.currentNode = nextNodeId;
      return this.execute(sessionId, input);
    }

    if (node.type === "agent") {
      const response = await this.runAgent(node.agent!, input);
      session.memory.push({ role: "assistant", content: response });
      return response;
    }

    throw new Error("Tipo de nodo no soportado");
  }

  private async route(input: string, allowedChildren: string[]): Promise<string> {
    const classification = await ai.generate({
      model: "googleai/gemini-1.5-flash",
      prompt: `${classifyPrompt}\nUsuario: ${input}`,
    });

    const raw = (classification.text || "").toUpperCase();

    if (raw.includes("CATALOGO") && allowedChildren.includes("catalog"))
      return "catalog";

    if (raw.includes("AGENDA") && allowedChildren.includes("agenda"))
      return "agenda";

    if (allowedChildren.includes("faq"))
      return "faq";

    return allowedChildren[0];
  }

  private async runAgent(agent: AgentType, input: string): Promise<string> {
    switch (agent) {
      case "FAQ":
        return await runFaqAgent(input);

      case "CATALOGO":
        return await runCatalogAgent(input);

      case "AGENDA":
        return await runAgendaAgent(input);

      default:
        throw new Error("Agente no válido");
    }
  }

  static resetSession(sessionId: string) {
    sessions.delete(sessionId);
  }
}