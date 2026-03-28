import axios from 'axios';

export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}

export class JiraService {
  static async testConnection(config: JiraConfig): Promise<boolean> {
    try {
      const response = await axios.get(`${config.baseUrl}/rest/api/3/myself`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Jira connection test failed:', error);
      return false;
    }
  }

  static async fetchIssue(config: JiraConfig, issueId: string): Promise<any> {
    try {
      const response = await axios.get(`${config.baseUrl}/rest/api/3/issue/${issueId}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Jira issue:', error);
      throw error;
    }
  }
}
