import { Router } from 'express';
import { JiraService } from '../services/jiraService';

const router = Router();

router.post('/test-connection', async (req, res) => {
  const { baseUrl, email, apiToken } = req.body;
  try {
    // Basic normalization: trim trailing slash to prevent double // in path construction
    const normalizedUrl = baseUrl.replace(/\/$/, '');
    const isConnected = await JiraService.testConnection({ baseUrl: normalizedUrl, email, apiToken });
    res.json({ isConnected });
  } catch (error: any) {
    console.error('Test connection error:', error);
    res.status(500).json({ error: error.message || 'Server crash during connection test' });
  }
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
