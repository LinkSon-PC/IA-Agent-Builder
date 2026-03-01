import { FlowEngine } from "../engine/flowEngine.js";

export async function mainFlow(input: {
  sessionId: string;
  message: string;
  flow: any;
}) {
  const engine = new FlowEngine(input.flow);

  const response = await engine.execute(
    input.sessionId,
    input.message
  );

  return { response };
}