import axios from 'axios';
import OpenAI from 'openai';
import { Groq } from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

export interface LLMConfig {
  provider: 'ollama' | 'openai' | 'groq' | 'gemini' | 'anthropic';
  baseUrl?: string;
  apiKey?: string;
  model: string;
}

export class LLMService {
  static async testConnection(config: LLMConfig): Promise<boolean> {
    try {
      switch (config.provider) {
        case 'ollama':
          // Test Ollama by calling tags endpoint
          const ollamaUrl = config.baseUrl || 'http://localhost:11434';
          await axios.get(`${ollamaUrl}/api/tags`);
          return true;
        case 'openai':
          const openai = new OpenAI({ apiKey: config.apiKey });
          await openai.models.list();
          return true;
        case 'groq':
          const groq = new Groq({ apiKey: config.apiKey });
          await groq.models.list();
          return true;
        case 'gemini':
          const genAI = new GoogleGenerativeAI(config.apiKey!);
          const model = genAI.getGenerativeModel({ model: config.model || 'gemini-1.5-flash' });
          // Small test prompt
          await model.generateContent("Hello");
          return true;
        case 'anthropic':
          const anthropic = new Anthropic({ apiKey: config.apiKey });
          await anthropic.messages.create({
            model: config.model,
            max_tokens: 1,
            messages: [{ role: 'user', content: 'H' }],
          });
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error('LLM connection test failed:', error);
      return false;
    }
  }

  static async generate(config: LLMConfig, prompt: string): Promise<string> {
    switch (config.provider) {
      case 'ollama':
        const ollamaUrl = config.baseUrl || 'http://localhost:11434';
        const response = await axios.post(`${ollamaUrl}/api/generate`, {
          model: config.model,
          prompt: prompt,
          stream: false,
        });
        return response.data.response;

      case 'openai':
        const openai = new OpenAI({ apiKey: config.apiKey });
        const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: config.model,
        });
        return chatCompletion.choices[0].message.content || '';

      case 'groq':
        const groq = new Groq({ apiKey: config.apiKey });
        const groqResponse = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: config.model,
        });
        return groqResponse.choices[0].message.content || '';

      case 'gemini':
        const genAI = new GoogleGenerativeAI(config.apiKey!);
        const geminiModel = genAI.getGenerativeModel({ model: config.model });
        const geminiResult = await geminiModel.generateContent(prompt);
        return geminiResult.response.text();

      case 'anthropic':
        const anthropic = new Anthropic({ apiKey: config.apiKey });
        const msg = await anthropic.messages.create({
          model: config.model,
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        });
        return msg.content[0].type === 'text' ? msg.content[0].text : '';

      default:
        throw new Error('Unsupported LLM provider');
    }
  }
}
