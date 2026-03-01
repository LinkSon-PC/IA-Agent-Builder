import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { mainFlow } from "./flows/mainFlow.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.post("/chat", async (req, res) => {
    try {
        const { sessionId, message, flow } = req.body;
        const result = await mainFlow({
            sessionId,
            message,
            flow,
        });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error?.message ?? "Internal error",
        });
    }
});
app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
