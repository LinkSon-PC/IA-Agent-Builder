import { ai } from "../genkit.js";
import { classifyPrompt } from "../prompts/classifyPrompt.js";
import { runFaqAgent } from "../agents/faqAgent.js";
import { runCatalogAgent } from "../agents/catalogAgent.js";
import { runAgendaAgent } from "../agents/agendaAgent.js";
const sessions = new Map();
export class FlowEngine {
    flow;
    constructor(flow) {
        this.flow = flow;
    }
    getNode(nodeId) {
        return this.flow.nodes.find((n) => n.id === nodeId);
    }
    async execute(sessionId, input) {
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
        if (!node)
            throw new Error("Nodo inválido");
        if (node.type === "orchestrator") {
            const nextNodeId = await this.route(input, node.children || []);
            session.currentNode = nextNodeId;
            return this.execute(sessionId, input);
        }
        if (node.type === "agent") {
            const response = await this.runAgent(node.agent, input);
            session.memory.push({ role: "assistant", content: response });
            return response;
        }
        throw new Error("Tipo de nodo no soportado");
    }
    async route(input, allowedChildren) {
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
    async runAgent(agent, input) {
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
    static resetSession(sessionId) {
        sessions.delete(sessionId);
    }
}
