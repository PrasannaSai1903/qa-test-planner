import { Router } from 'express';
import { JiraService } from '../services/jiraService';

const router = Router();

router.post('/test-connection', async (req, res) => {
  const { baseUrl, email, apiToken } = req.body;
  const isConnected = await JiraService.testConnection({ baseUrl, email, apiToken });
  res.json({ isConnected });
});

router.post('/fetch-story', async (req, res) => {
  const { config, issueId } = req.body;
  try {
    const issue = await JiraService.fetchIssue(config, issueId);
    res.json(issue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
