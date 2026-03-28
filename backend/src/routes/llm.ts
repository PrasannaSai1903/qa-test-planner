import { Router } from 'express';
import { LLMService } from '../services/llmService';

const router = Router();

router.post('/test-connection', async (req, res) => {
  const { provider, baseUrl, apiKey, model } = req.body;
  const isConnected = await LLMService.testConnection({ provider, baseUrl, apiKey, model });
  res.json({ isConnected });
});

export default router;
