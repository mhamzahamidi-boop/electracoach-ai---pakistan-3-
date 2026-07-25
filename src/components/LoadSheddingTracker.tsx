import React, { useState } from 'react';
import { 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Building2, 
  ExternalLink,
  Info
} from 'lucide-react';
import { DiscoCode } from '../types';
import { DISCO_LIST } from '../data/discoData';

interface LoadSheddingTrackerProps {
  selectedDisco: DiscoCode;
}

const FEEDER_CATEGORIES = [
  { cat: 'Category 1 (0-10% Loss)', outageHours: '0 – 1 Hour', status: 'Minimal Outages', color: 'emerald' },
  { cat: 'Category 2 (10-20% Loss)', outageHours: '1 – 2 Hours', status: 'Low Outages', color: 'teal' },
  { cat: 'Category 3 (20-30% Loss)', outageHours: '2 – 4 Hours', status: 'Moderate Outages', color: 'amber' },
  { cat: 'Category 4 (30-40% Loss)', outageHours: '4 – 6 Hours', status: 'High Outages', color: 'orange' },
  { cat: 'Category 5 (> 40% High Loss)', outageHours: '6 – 8+ Hours', status: 'Severe Outages', color: 'rose' },
];

const FPA_TRENDS = [
  { month: 'July 2025', ratePkr: 'Rs 3.20 / unit', status: 'NEPRA Notified', discoImpact: 'All DISCOs' },
  { month: 'June 2025', ratePkr: 'Rs 2.85 / unit', status: 'Applied on Bill', discoImpact: 'Except KE' },
  { month: 'May 2025', ratePkr: 'Rs 3.41 / unit', status: 'Applied on Bill', discoImpact: 'All DISCOs' },
  { month: 'April 2025', ratePkr: 'Rs 2.75 / unit', status: 'Applied on Bill', discoImpact: 'All DISCOs' },
];

export const LoadSheddingTracker: React.FC<LoadSheddingTrackerProps> = ({ selectedDisco }) => {
  const [selectedCat, setSelectedCat] = useState<number>(0);

  const discoObj = DISCO_LIST.find((d) => d.code === selectedDisco) || DISCO_LIST[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Clock className="w-4 h-4" />
            <span>Feeder Outage Categories & NEPRA FPA Gazette</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Load Shedding Categories & Tariff Surcharge Updates
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Track electricity feeder loss categories, peak hours schedule, NEPRA Fuel Price Adjustment (FPA) notifications, and consumer rights for {discoObj.fullName}.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Feeder Loss Categories */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Feeder Category Load Shedding ({discoObj.name})</span>
              </h2>
              <p className="text-xs text-slate-400">Power outage hours depend on feeder line AT&C losses</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Peak: {discoObj.peakHours}
            </span>
          </div>

          <div className="space-y-3">
            {FEEDER_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedCat(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  selectedCat === idx
                    ? 'bg-slate-950 border-amber-500/50 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white block">{cat.cat}</span>
                  <span className="text-xs text-slate-400">Status: {cat.status}</span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black font-mono text-amber-400 block">{cat.outageHours}</span>
                  <span className="text-[10px] text-slate-500">Scheduled Outage / Day</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Info className="w-4 h-4" />
              <span>How to Check Your Feeder Category?</span>
            </div>
            <p>
              Your feeder category is listed at the top right of your printed {discoObj.name} bill next to your Reference Number. High theft or line loss feeders receive longer load shedding windows under NEPRA rules.
            </p>
          </div>
        </div>

        {/* Right Column: FPA Trend & NEPRA Notifications */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FPA Tracker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>NEPRA Fuel Price Adjustment (FPA) Trend</span>
            </h3>

            <div className="divide-y divide-slate-800 text-xs">
              {FPA_TRENDS.map((fpa, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">{fpa.month}</span>
                    <span className="text-[10px] text-slate-400">{fpa.discoImpact}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-blue-400 block">{fpa.ratePkr}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{fpa.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DISCO Contact & Helpline Card */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{discoObj.fullName} Helpline</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Emergency Outage Helpline:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">118</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Direct Office Contact:</span>
                <span className="font-mono font-bold text-white">{discoObj.contactNumber}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Headquarters City:</span>
                <span className="font-bold text-emerald-400">{discoObj.city}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
