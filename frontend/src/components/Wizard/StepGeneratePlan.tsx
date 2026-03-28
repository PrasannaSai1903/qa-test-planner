import React, { useState, useEffect } from 'react';
import { WizardData } from './WizardModal';
import { FileDown, Loader2, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

interface StepProps {
  data: WizardData;
  updateData: (newData: Partial<WizardData>) => void;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const StepGeneratePlan: React.FC<StepProps> = ({ data, updateData }) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async () => {
    setGenerating(true);
    setError(null);
    try {
      const resp = await axios.post(`${API_BASE}/generate`, {
        config: data.llmConfig,
        jiraConfig: data.jiraConfig,
        context: data.storyData,
        jiraIssueId: data.storyData.source === 'jira' ? data.storyData.jiraIssueId : undefined,
        manualText: data.storyData.source === 'manual' ? data.storyData.manualText : undefined,
        templatePath: data.template.path,
      });
      updateData({ result: resp.data.content });
      toast.success('Test Plan Generated!');
    } catch (e: any) {
      console.error(e);
      const msg = e.response?.data?.error || 'Failed to generate test plan. Check backend connection and LLM configuration.';
      setError(msg);
      toast.error('Generation Failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (format: string) => {
    try {
      const resp = await axios.post(`${API_BASE}/export/${format}`, {
        content: data.result,
        fileName: `TestPlan_${data.storyData.jiraIssueId || 'Draft'}`
      }, { 
        responseType: 'blob'
      });

      // Get filename from Content-Disposition if present
      const disposition = resp.headers['content-disposition'];
      let filename = `test-plan.${format}`;
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '').trim();
        }
      }

      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Use timeout for safer cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('Download started');
    } catch (e) {
      console.error(e);
      toast.error('Export failed.');
    }
  };

  useEffect(() => {
    if (!data.result && !generating && !error) {
      generatePlan();
    }
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Generated Test Plan</h3>
        </div>

        <div className="flex items-center gap-2">
          {data.result && (
            <>
              <button 
                onClick={generatePlan}
                className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} /> Regenerate
              </button>
              <div className="h-6 w-px bg-slate-700 mx-2" />
              <button onClick={() => handleDownload('docx')} className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm border-indigo-500/20 hover:bg-indigo-500/10">
                <FileDown className="w-4 h-4" /> DOCX
              </button>
              <button onClick={() => handleDownload('pdf')} className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm border-indigo-500/20 hover:bg-indigo-500/10">
                <FileDown className="w-4 h-4" /> PDF
              </button>
              <button onClick={() => handleDownload('md')} className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm border-indigo-500/20 hover:bg-indigo-500/10">
                <FileDown className="w-4 h-4" /> MD
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-[400px] glass p-8 overflow-y-auto bg-slate-900/40 relative">
        {generating && (
          <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-lg font-medium text-slate-300 animate-pulse">AI is crafting your test plan...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
            <AlertTriangle className="w-16 h-16 text-rose-500/50" />
            <div className="space-y-2 max-w-md">
              <h4 className="text-xl font-bold text-white">Something went wrong</h4>
              <p className="text-slate-400">{error}</p>
            </div>
            <button onClick={generatePlan} className="btn-primary mt-4 py-2 px-6">Try Again</button>
          </div>
        )}

        {data.result && (
          <div className="prose prose-invert prose-indigo max-w-none">
            <ReactMarkdown>{data.result}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
