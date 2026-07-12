import {
  StateGraph,
  START,
  MemorySaver,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import crypto from "crypto";
dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

const model = new ChatGroq({
  model: "openai/gpt-oss-20b",
});

const callModel = async (state: typeof MessagesAnnotation.State) => {
  console.log("that is runing", state);
  const response = await model.invoke(state.messages);
  console.log("this is response", response);
  return { messages: [response] };
};

const checkpointer = new MemorySaver();
const builder = new StateGraph(MessagesAnnotation)
  .addNode("call_model", callModel)
  .addEdge(START, "call_model");
const graph = builder.compile({ checkpointer });

// const config = { configurable: { thread_id: "1" } };
// await graph.invoke(
//   { messages: [{ role: "user", content: "hi, my name is bob" }] },
//   config,
// );
// await graph.invoke(
//   { messages: [{ role: "user", content: "write a short poem about cats" }] },
//   config,
// );
// await graph.invoke(
//   { messages: [{ role: "user", content: "now do the same but for dogs" }] },
//   config,
// );
// const finalResponse = await graph.invoke(
//   { messages: [{ role: "user", content: "what's my name?" }] },
//   config,
// );

// console.log(finalResponse);

async function AgentCalled(userInput: string, ThreadID: string | undefined) {
  return await graph.invoke(
    { messages: [{ role: "user", content: userInput }] },
    { configurable: { thread_id: ThreadID } },
  );
}
function handleThreadId(id: string, store: string[]): string {
  if (id && store.includes(id)) {
    console.log("This is from ", id);
    return id;
  }
  const newId = id;
  console.log("this is new id", newId);
  if (!store.includes(newId)) store.push(newId);
  return newId;
}
export { AgentCalled, handleThreadId };
