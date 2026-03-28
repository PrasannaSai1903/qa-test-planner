import React from 'react';
import { PlusCircle, FlaskConical, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  onStart: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStart }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <FlaskConical className="w-16 h-16 text-indigo-400" />
          </div>
        </div>

        <h1 className="text-6xl font-bold tracking-tight">
          QA <span className="gradient-text">Test Planner</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Create comprehensive test plans in seconds using AI. Connect to Jira, 
          analyze stories, and generate formatted test cases based on your company templates.
        </p>

        <div className="flex flex-col items-center gap-6 pt-8">
          <button 
            onClick={onStart}
            className="btn-primary flex items-center gap-3 text-lg px-8 py-4 group hover:scale-105"
          >
            <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            Create Test Planner
          </button>
          <p className="text-slate-500 text-sm">No credit card required. Free to get started.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
        {[
          { icon: Zap, title: "AI-Powered", desc: "Advanced LLM support for precise test generation" },
          { icon: ShieldCheck, title: "Jira Sync", desc: "Seamless integration with your existing workflow" },
          { icon: PlusCircle, title: "Formattable", desc: "Export to DOCX, PDF, and Markdown instantly" },
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass p-8 space-y-4 hover:border-indigo-500/30 transition-colors"
          >
            <feature.icon className="w-8 h-8 text-indigo-400" />
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-slate-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
