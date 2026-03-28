import React, { useState, useEffect } from 'react';
import { WizardData } from './WizardModal';
import { FileText, Link, Upload, CheckCircle, PencilLine, FileJson } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface StepProps {
  data: WizardData;
  updateData: (newData: Partial<WizardData>) => void;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const StepContextStory: React.FC<StepProps> = ({ data, updateData }) => {
  const [fetchingIssue, setFetchingIssue] = useState(false);

  useEffect(() => {
    // If Jira is not connected, default to manual input
    if (!data.jiraConfig.isConnected && data.storyData.source === 'jira') {
      updateData({ storyData: { ...data.storyData, source: 'manual' } });
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('template', file);

    try {
      const resp = await axios.post(`${API_BASE}/template/upload`, formData);
      updateData({ template: { name: resp.data.filename, path: resp.data.path } });
      toast.success('Template updated!');
    } catch (e) {
      toast.error('Error uploading template.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white">Feature Context</h3>
        <p className="text-slate-400">Provide the details of the feature you want to test.</p>
      </div>

      <div className="space-y-6">
        {/* Source Toggle */}
        <div className="flex bg-slate-900/50 p-1.5 rounded-xl w-fit mx-auto border border-slate-700/50 backdrop-blur-sm">
          <button 
            onClick={() => {
              if (!data.jiraConfig.isConnected) {
                toast.error('Jira not connected. Please go back to Step 1 or use Manual Input.');
                return;
              }
              updateData({ storyData: { ...data.storyData, source: 'jira' } });
            }}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
              data.storyData.source === 'jira' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
            } ${!data.jiraConfig.isConnected ? 'opacity-50 grayscale select-none' : ''}`}
          >
            <Link className="w-4 h-4" /> Jira Issue
          </button>
          <button 
            onClick={() => updateData({ storyData: { ...data.storyData, source: 'manual' } })}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
              data.storyData.source === 'manual' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PencilLine className="w-4 h-4" /> Manual Input
          </button>
        </div>

        {/* Input Field */}
        <div className="glass p-8 space-y-6">
          {data.storyData.source === 'jira' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <FileJson className="w-4 h-4" /> Jira Story / Epic ID
              </label>
              <input 
                type="text" 
                placeholder="PROJ-123"
                className="input-field text-lg"
                value={data.storyData.jiraIssueId}
                onChange={e => updateData({ storyData: { ...data.storyData, jiraIssueId: e.target.value } })}
              />
              <p className="text-xs text-slate-500">Enter the ticket ID from your Jira project.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <PencilLine className="w-4 h-4" /> Feature Description
              </label>
              <textarea 
                rows={4}
                placeholder="Describe the feature or paste your requirements here..."
                className="input-field resize-none text-lg"
                value={data.storyData.manualText}
                onChange={e => updateData({ storyData: { ...data.storyData, manualText: e.target.value } })}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Additional Context (Optional)</label>
            <textarea 
              rows={3}
              placeholder="Any extra constraints, edge cases, or documents to consider..."
              className="input-field resize-none"
              value={data.storyData.additionalInfo}
              onChange={e => updateData({ storyData: { ...data.storyData, additionalInfo: e.target.value } })}
            />
          </div>
        </div>

        {/* Template Selection */}
        <div className="glass p-6 border-indigo-500/20 bg-indigo-500/5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-bold text-white">Using Template</h4>
                <p className="text-sm text-slate-400">{data.template.name}</p>
              </div>
            </div>
            
            <label className="btn-secondary flex items-center gap-2 cursor-pointer group">
              <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> 
              Change Template
              <input type="file" className="hidden" accept=".docx" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
