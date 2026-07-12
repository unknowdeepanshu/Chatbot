import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { handleThreadId, AgentCalled } from "./langgraph/AgentCalled.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// let ThreadIdStore = ["chat-1"];

app.get("/", (req: Request, res: Response) => {
  res.json({ ji: "cjec", duck: "doe" });
});
app.get("/test", (req: Request, res: Response) => {
  res.send("<h1> hi buddy</h1>");
});

// Agent called
app.post("/api/Called", async (req: Request, res: Response) => {
  const { userInput, threadID, ThreadIdStore } = req.body;

  if (typeof userInput !== "string" || userInput.trim().length === 0) {
    return res.status(400).json({
      status: "400",
      error: "userInput is required and must be a non-empty string",
    });
  }
  console.log("this is store", ThreadIdStore);
  console.log("this is storeid", threadID);
  const incomingThreadId = typeof threadID === "string" ? threadID.trim() : "";

  const id = handleThreadId(incomingThreadId, ThreadIdStore);
  console.log("this is id", id);
  const Output = await AgentCalled(userInput, id);
  const conversationPairs = [];
  for (let i = 0; i < Output["messages"].length; i += 2) {
    const userMessage = Output["messages"][i];
    const aiMessage = Output["messages"][i + 1];

    conversationPairs.push({
      human: userMessage?.content || "",
      ai: aiMessage?.content || "",
    });
  }

  console.log("this is conversation pairs", conversationPairs);
  res.json({
    threadID: id,
    conversationPairs: conversationPairs,
    showStore: ThreadIdStore,
    status: "200",
  });
});

app.listen(3040, () => {
  console.log("Server is running on http://localhost:3040");
});
