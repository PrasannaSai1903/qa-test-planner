import { Router, Request, Response } from 'express';
import { LLMService } from '../services/llmService';
import { TemplateService } from '../services/templateService';
import { JiraService } from '../services/jiraService';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { config, jiraConfig, context, jiraIssueId, templatePath, manualText } = req.body;
  
  try {
    // Validate LLM config
    if (!config || !config.provider) {
      res.status(400).json({ error: 'LLM configuration is required. Please go back to Step 1 and connect an LLM provider.' });
      return;
    }

    let sourceContent = '';
    
    // Fetch from Jira if provided
    if (jiraIssueId && jiraConfig && jiraConfig.baseUrl) {
      try {
        const issue = await JiraService.fetchIssue(jiraConfig, jiraIssueId);
        sourceContent = `
Jira Issue: ${issue.key}
Summary: ${issue.fields.summary}
Description: ${issue.fields.description || 'No description provided'}
`;
      } catch (jiraError: any) {
        console.error('Jira fetch error:', jiraError.message);
        res.status(500).json({ error: `Failed to fetch Jira issue "${jiraIssueId}". Check your Jira credentials and issue ID. Error: ${jiraError.message}` });
        return;
      }
    } else if (manualText) {
      sourceContent = manualText;
    } else {
      res.status(400).json({ error: 'No story content provided. Please enter a Jira Issue ID or manual text in Step 2.' });
      return;
    }

    // Load template for schema
    const schema = await TemplateService.getTemplateSchema(templatePath || TemplateService.getDefaultTemplatePath());

    const prompt = `
Generate a comprehensive Test Plan and Test Cases based on the following input and existing template structure.
Output the result in Markdown format.

Input Context:
${sourceContent}

Additional Context:
${context?.additionalInfo || 'None provided'}

Structure Reference (Template):
${schema}

IMPORTANT: Follow the template's section structure exactly. Generate detailed test cases with IDs, descriptions, preconditions, steps, expected results, and priorities.
`;

    console.log(`[Generate] Provider: ${config.provider}, Model: ${config.model}`);
    console.log(`[Generate] Source content length: ${sourceContent.length} chars`);

    const generatedContent = await LLMService.generate(config, prompt);
    res.json({ content: generatedContent });
  } catch (error: any) {
    console.error('Generation Error:', error.message || error);
    
    // Provide user-friendly error messages
    let userMessage = error.message || 'Unknown error occurred';
    if (userMessage.includes('ECONNREFUSED') || userMessage.includes('connect ECONNREFUSED')) {
      userMessage = `Cannot connect to ${config?.provider || 'LLM'} service. Make sure the service is running. ${config?.provider === 'ollama' ? 'Start Ollama with: ollama serve' : 'Check your API key and network connection.'}`;
    } else if (userMessage.includes('404')) {
      userMessage = `Model "${config?.model}" not found. Make sure the model is available. ${config?.provider === 'ollama' ? `Run: ollama pull ${config?.model}` : 'Check your model name.'}`;
    }
    
    res.status(500).json({ error: userMessage });
  }
});

export default router;
