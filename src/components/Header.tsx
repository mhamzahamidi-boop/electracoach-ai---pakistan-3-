import React from 'react';
import { Zap, Bot, Languages, Calculator, Upload, Sun, Cpu, Clock, Sparkles } from 'lucide-react';
import { DiscoCode } from '../types';
import { DISCO_LIST } from '../data/discoData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDisco: DiscoCode;
  setSelectedDisco: (disco: DiscoCode) => void;
  language: 'EN' | 'UR' | 'RU';
  setLanguage: (lang: 'EN' | 'UR' | 'RU') => void;
  onOpenAiCoach: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedDisco,
  setSelectedDisco,
  language,
  setLanguage,
  onOpenAiCoach,
}) => {
  const currentDiscoObj = DISCO_LIST.find((d) => d.code === selectedDisco) || DISCO_LIST[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-semibold px-4 py-1.5 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-950 text-amber-400 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide">
            NEPRA 2025/2026
          </span>
          <span>⚡ NEPRA Latest Slab Tariff Rates & Fuel Price Adjustment (FPA) Applied!</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {currentDiscoObj.name} Peak Hours: <strong className="underline">{currentDiscoObj.peakHours}</strong>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('calculator')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  ElectraCoach <span className="text-amber-400 font-bold">AI</span>
                </span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                  PK ⚡
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none hidden sm:block">
                Pakistan Electricity Bill & Solar Advisor
              </p>
            </div>
          </div>

          {/* DISCO Selector & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* DISCO Dropdown */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm">
              <span className="text-slate-400 text-xs mr-1.5 font-medium hidden md:inline">DISCO:</span>
              <select
                value={selectedDisco}
                onChange={(e) => setSelectedDisco(e.target.value as DiscoCode)}
                className="bg-transparent text-amber-400 font-bold cursor-pointer outline-none text-xs sm:text-sm"
              >
                {DISCO_LIST.map((disco) => (
                  <option key={disco.code} value={disco.code} className="bg-slate-900 text-white font-normal">
                    {disco.name} ({disco.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  language === 'EN' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('UR')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  language === 'UR' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Urdu Language"
              >
                اردو
              </button>
              <button
                onClick={() => setLanguage('RU')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  language === 'RU' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Roman Urdu"
              >
                R.Urdu
              </button>
            </div>

            {/* AI Coach Trigger Button */}
            <button
              onClick={onOpenAiCoach}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs sm:text-sm shadow-md shadow-amber-500/10 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span className="hidden xs:inline">Ask AI Coach</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 py-2 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'calculator'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Bill Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'scanner'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>AI Bill Scanner</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1 rounded-full">Vision</span>
          </button>

          <button
            onClick={() => setActiveTab('solar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'solar'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Solar Net Metering</span>
          </button>

          <button
            onClick={() => setActiveTab('appliances')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'appliances'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Appliance Wattage Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('feeder')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'feeder'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Load Shedding & Tariffs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
