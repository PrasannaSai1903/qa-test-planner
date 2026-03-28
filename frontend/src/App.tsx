import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { WizardModal } from './components/Wizard/WizardModal';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleStartWizard = () => {
    setIsWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Toaster position="top-right" />
      
      {!isWizardOpen ? (
        <Dashboard onStart={handleStartWizard} />
      ) : (
        <WizardModal onClose={() => setIsWizardOpen(false)} />
      )}
    </div>
  );
}

export default App;
