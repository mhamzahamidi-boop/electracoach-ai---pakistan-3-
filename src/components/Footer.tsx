import React from 'react';
import { Zap, Building2, PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { DISCO_LIST } from '../data/discoData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16 text-xs">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Zap className="w-5 h-5 fill-slate-950" />
              </div>
              <span className="font-extrabold text-lg text-white">ElectraCoach AI ⚡ Pakistan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Pakistan’s premier AI-powered electricity tariff optimizer, bill calculator, solar net metering advisor, and smart appliance energy coach.
            </p>
            <p className="text-[11px] text-amber-400/90 font-mono">
              Aligned with NEPRA 2025/2026 Tariff Notifications & DISCO Guidelines.
            </p>
          </div>

          {/* DISCO Quick Contacts */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>DISCO Emergency Helplines</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {DISCO_LIST.slice(0, 8).map((disco) => (
                <div key={disco.code} className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-slate-200">{disco.name}</span>
                  <span className="font-mono text-amber-400">{disco.contactNumber.split('/')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consumer Rights */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Consumer Rights & NEPRA</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>• Right to official DISCO meter accuracy test report</li>
              <li>• Protected category re-qualification after 6 months &lt;= 200 units</li>
              <li>• Solar Net Metering export credit adjustment in bill</li>
              <li>• NEPRA Regional Consumer Grievance Cells (118)</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} ElectraCoach AI ⚡ Pakistan. Designed for Pakistani Households & Businesses.</p>
          <div className="flex items-center gap-4">
            <span>DISCO Tariff Slabs 2025/2026</span>
            <span>•</span>
            <span>Solar Net Metering Rules</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
