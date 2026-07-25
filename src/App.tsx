import React, { useState } from 'react';
import { Header } from './components/Header';
import { BillCalculator } from './components/BillCalculator';
import { BillScanner } from './components/BillScanner';
import { SolarCalculator } from './components/SolarCalculator';
import { ApplianceAudit } from './components/ApplianceAudit';
import { LoadSheddingTracker } from './components/LoadSheddingTracker';
import { AICoachDrawer } from './components/AICoachDrawer';
import { Footer } from './components/Footer';
import { DiscoCode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('calculator');
  const [selectedDisco, setSelectedDisco] = useState<DiscoCode>('LESCO');
  const [language, setLanguage] = useState<'EN' | 'UR' | 'RU'>('EN');
  const [isAiCoachOpen, setIsAiCoachOpen] = useState<boolean>(false);
  const [aiCoachContext, setAiCoachContext] = useState<any>(null);

  const handleOpenAiCoachWithContext = (context: any) => {
    setAiCoachContext(context);
    setIsAiCoachOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDisco={selectedDisco}
        setSelectedDisco={setSelectedDisco}
        language={language}
        setLanguage={setLanguage}
        onOpenAiCoach={() => {
          setAiCoachContext(null);
          setIsAiCoachOpen(true);
        }}
      />

      {/* Main Container Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calculator' && (
          <BillCalculator
            selectedDisco={selectedDisco}
            setSelectedDisco={setSelectedDisco}
            language={language}
            onNavigateToSolar={() => setActiveTab('solar')}
            onNavigateToScan={() => setActiveTab('scanner')}
            onOpenAiCoachWithContext={handleOpenAiCoachWithContext}
          />
        )}

        {activeTab === 'scanner' && (
          <BillScanner
            selectedDisco={selectedDisco}
            onOpenAiCoachWithContext={handleOpenAiCoachWithContext}
          />
        )}

        {activeTab === 'solar' && (
          <SolarCalculator
            selectedDisco={selectedDisco}
            onOpenAiCoachWithContext={handleOpenAiCoachWithContext}
          />
        )}

        {activeTab === 'appliances' && (
          <ApplianceAudit
            selectedDisco={selectedDisco}
            onOpenAiCoachWithContext={handleOpenAiCoachWithContext}
          />
        )}

        {activeTab === 'feeder' && (
          <LoadSheddingTracker selectedDisco={selectedDisco} />
        )}
      </main>

      {/* AI Coach Slide-Over Drawer */}
      <AICoachDrawer
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        selectedDisco={selectedDisco}
        language={language}
        initialContext={aiCoachContext}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
