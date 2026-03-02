import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { FlowEngine } from './engine/flowEngine.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const flowEngine = new FlowEngine();

app.post('/api/orchestrate', async (req, res) => {
  try {
    const { input, metadata } = req.body;

    if (!input) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing workflow input'
      });
    }

    const query = metadata?.query ?? '';

    const result = await flowEngine.execute(input, query);

    return res.json({
      status: 'ok',
      result
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Execution failed'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});