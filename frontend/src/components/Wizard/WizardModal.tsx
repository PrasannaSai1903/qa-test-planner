import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { StepConnectAgents } from './StepConnectAgents';
import { StepContextStory } from './StepContextStory';
import { StepGeneratePlan } from './StepGeneratePlan';

interface WizardModalProps {
  onClose: () => void;
}

export type WizardData = {
  jiraConfig: { baseUrl: string; email: string; apiToken: string; isConnected: boolean };
  llmConfig: { provider: string; baseUrl: string; apiKey: string; model: string; isConnected: boolean };
  storyData: { source: 'jira' | 'manual'; jiraIssueId: string; manualText: string; additionalInfo: string };
  template: { name: string; path: string };
  result: string;
};

const initialData: WizardData = {
  jiraConfig: { baseUrl: '', email: '', apiToken: '', isConnected: false },
  llmConfig: { provider: 'ollama', baseUrl: 'http://localhost:11434', apiKey: '', model: 'gpt-oss:20b-cloud', isConnected: false },
  storyData: { source: 'jira', jiraIssueId: '', manualText: '', additionalInfo: '' },
  template: { name: 'Test Plan - Project1 - SOAP .docx', path: '' },
  result: '',
};

export const WizardModal: React.FC<WizardModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateData = (newData: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const steps = [
    { id: 1, label: 'Connect Agents' },
    { id: 2, label: 'Context & Story' },
    { id: 3, label: 'Generate Plan' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl h-[85vh] glass flex flex-col relative overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold gradient-text">Test Plan Generator Workspace</h2>
            <div className="flex items-center gap-3">
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step >= s.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                    </div>
                    <span className={`text-sm font-medium ${step >= s.id ? 'text-slate-200' : 'text-slate-500'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && <div className="w-8 h-px bg-slate-800" />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <StepConnectAgents data={data} updateData={updateData} />}
              {step === 2 && <StepContextStory data={data} updateData={updateData} />}
              {step === 3 && <StepGeneratePlan data={data} updateData={updateData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex items-center justify-between bg-slate-900/50">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          <div className="flex items-center gap-4">
            {step < 3 && (
              <button 
                onClick={nextStep}
                disabled={step === 1 ? !data.llmConfig.isConnected : false}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
