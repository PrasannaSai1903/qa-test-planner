import React, { useState } from 'react';
import { WizardData } from './WizardModal';
import { Database, ShieldCheck, Cpu, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface StepProps {
  data: WizardData;
  updateData: (newData: Partial<WizardData>) => void;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const StepConnectAgents: React.FC<StepProps> = ({ data, updateData }) => {
  const [testingJira, setTestingJira] = useState(false);
  const [testingLLM, setTestingLLM] = useState(false);

  const testJira = async () => {
    setTestingJira(true);
    try {
      const resp = await axios.post(`${API_BASE}/jira/test-connection`, data.jiraConfig);
      if (resp.data.isConnected) {
        updateData({ jiraConfig: { ...data.jiraConfig, isConnected: true } });
        toast.success('Jira connected successfully!');
      } else {
        toast.error('Jira connection failed. Check credentials.');
      }
    } catch (e) {
      toast.error('Error connecting to Jira service.');
    } finally {
      setTestingJira(false);
    }
  };

  const testLLM = async () => {
    setTestingLLM(true);
    try {
      const resp = await axios.post(`${API_BASE}/llm/test-connection`, data.llmConfig);
      if (resp.data.isConnected) {
        // If it's Ollama, let's try to see if we can get models
        if (data.llmConfig.provider === 'ollama') {
          try {
            const tagsResp = await axios.get(`${data.llmConfig.baseUrl}/api/tags`);
            const models = tagsResp.data.models.map((m: any) => m.name);
            console.log('Available models:', models);
            if (!models.includes(data.llmConfig.model) && models.length > 0) {
              toast(`Note: "${data.llmConfig.model}" not found. Suggested: ${models[0]}`, { icon: 'ℹ️' });
            }
          } catch (e) {
            console.error('Could not fetch tags', e);
          }
        }
        updateData({ llmConfig: { ...data.llmConfig, isConnected: true } });
        toast.success(`${data.llmConfig.provider} connected successfully!`);
      } else {
        toast.error('LLM connection failed. Check configuration.');
      }
    } catch (e) {
      toast.error('Error connecting to LLM service.');
    } finally {
      setTestingLLM(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white">Configure Connections</h3>
        <p className="text-slate-400">Set up your Jira and AI model integration to begin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Jira Connection */}
        <div className="glass p-8 space-y-6 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold">Jira Tracking</h4>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-slate-800 text-slate-500 border border-slate-700">Optional</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Jira Base URL</label>
              <input 
                type="text" 
                placeholder="https://your-domain.atlassian.net"
                className="input-field"
                value={data.jiraConfig.baseUrl}
                onChange={e => updateData({ jiraConfig: { ...data.jiraConfig, baseUrl: e.target.value, isConnected: false } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="input-field"
                value={data.jiraConfig.email}
                onChange={e => updateData({ jiraConfig: { ...data.jiraConfig, email: e.target.value, isConnected: false } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">API Token</label>
              <input 
                type="password" 
                placeholder="••••••••••••••••"
                className="input-field"
                value={data.jiraConfig.apiToken}
                onChange={e => updateData({ jiraConfig: { ...data.jiraConfig, apiToken: e.target.value, isConnected: false } })}
              />
            </div>
          </div>

          <button 
            onClick={testJira}
            disabled={testingJira || !data.jiraConfig.baseUrl || !data.jiraConfig.email || !data.jiraConfig.apiToken}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              data.jiraConfig.isConnected 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {testingJira ? <Loader2 className="w-5 h-5 animate-spin" /> : data.jiraConfig.isConnected ? <CheckCircle2 className="w-5 h-5" /> : null}
            {data.jiraConfig.isConnected ? 'Connected' : 'Connect Jira'}
          </button>
        </div>

        {/* LLM Connection */}
        <div className="glass p-8 space-y-6 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Cpu className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-xl font-bold">LLM Intelligence</h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Provider</label>
              <select 
                className="input-field"
                value={data.llmConfig.provider}
                onChange={e => updateData({ llmConfig: { ...data.llmConfig, provider: e.target.value, isConnected: false } })}
              >
                <option value="ollama">Ollama (Local)</option>
                <option value="openai">OpenAI</option>
                <option value="groq">Groq (Cloud API)</option>
                <option value="gemini">Google Gemini</option>
                <option value="anthropic">Anthropic Claude</option>
              </select>
            </div>

            {data.llmConfig.provider === 'ollama' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Base URL</label>
                <input 
                  type="text" 
                  placeholder="http://localhost:11434"
                  className="input-field"
                  value={data.llmConfig.baseUrl}
                  onChange={e => updateData({ llmConfig: { ...data.llmConfig, baseUrl: e.target.value, isConnected: false } })}
                />
              </div>
            )}

            {data.llmConfig.provider !== 'ollama' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">API Key</label>
                <input 
                  type="password" 
                  placeholder="sk-..."
                  className="input-field"
                  value={data.llmConfig.apiKey}
                  onChange={e => updateData({ llmConfig: { ...data.llmConfig, apiKey: e.target.value, isConnected: false } })}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Model Name</label>
              <input 
                type="text" 
                placeholder={data.llmConfig.provider === 'ollama' ? 'llama3' : 'gpt-4'}
                className="input-field"
                value={data.llmConfig.model}
                onChange={e => updateData({ llmConfig: { ...data.llmConfig, model: e.target.value, isConnected: false } })}
              />
            </div>
          </div>

          <button 
            onClick={testLLM}
            disabled={testingLLM || !data.llmConfig.model}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              data.llmConfig.isConnected 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {testingLLM ? <Loader2 className="w-5 h-5 animate-spin" /> : data.llmConfig.isConnected ? <CheckCircle2 className="w-5 h-5" /> : null}
            {data.llmConfig.isConnected ? 'Connected' : 'Connect LLM'}
          </button>
        </div>
      </div>
    </div>
  );
};
