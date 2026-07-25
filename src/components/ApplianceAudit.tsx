import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Plus, 
  Trash2, 
  Zap, 
  BatteryCharging, 
  Clock, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  Fan,
  Tv,
  Flame,
  Power
} from 'lucide-react';
import { ApplianceItem, DiscoCode } from '../types';
import { SAMPLE_APPLIANCES } from '../data/discoData';

interface ApplianceAuditProps {
  selectedDisco: DiscoCode;
  onOpenAiCoachWithContext: (context: any) => void;
}

export const ApplianceAudit: React.FC<ApplianceAuditProps> = ({
  selectedDisco,
  onOpenAiCoachWithContext,
}) => {
  const [appliances, setAppliances] = useState<ApplianceItem[]>(SAMPLE_APPLIANCES);
  
  // Custom Appliance Modal / Inputs State
  const [newName, setNewName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ApplianceItem['category']>('Cooling');
  const [newWattage, setNewWattage] = useState<number>(1000);
  const [newHours, setNewHours] = useState<number>(8);
  const [newQty, setNewQty] = useState<number>(1);
  const [newIsPeak, setNewIsPeak] = useState<boolean>(true);

  // UPS Estimator State
  const [batteryAmps, setBatteryAmps] = useState<number>(200); // 200Ah battery
  const [batteryCount, setBatteryCount] = useState<number>(1); // 1 battery
  const [batteryVoltage, setBatteryVoltage] = useState<number>(12); // 12V
  const [upsEfficiency, setUpsEfficiency] = useState<number>(85); // 85% efficiency

  // Calculations
  const auditSummary = useMemo(() => {
    let totalDailyKwh = 0;
    let totalPeakKwh = 0;
    let totalWattageOn = 0;

    appliances.forEach((app) => {
      const dailyConsumption = (app.wattage * app.hoursPerDay * app.quantity) / 1000;
      totalDailyKwh += dailyConsumption;
      totalWattageOn += app.wattage * app.quantity;

      if (app.isPeakUsage) {
        // Assume 3 hours of usage during peak window
        const peakHrs = Math.min(app.hoursPerDay, 4);
        totalPeakKwh += (app.wattage * peakHrs * app.quantity) / 1000;
      }
    });

    const totalMonthlyKwh = Math.round(totalDailyKwh * 30);
    const averageTariffPerUnit = 39.0;
    const estimatedMonthlyCostPkr = Math.round(totalMonthlyKwh * averageTariffPerUnit);
    
    // Peak hour extra cost impact (Peak rate Rs 49.35 vs Off-Peak Rs 35.50 = Rs 13.85 diff)
    const monthlyPeakExtraCostPkr = Math.round(totalPeakKwh * 30 * 13.85);

    return {
      totalDailyKwh: Number(totalDailyKwh.toFixed(2)),
      totalMonthlyKwh,
      estimatedMonthlyCostPkr,
      monthlyPeakExtraCostPkr,
      totalWattageOn,
    };
  }, [appliances]);

  // UPS Backup Time Calculation Formula: Backup Hours = (Ah * V * Efficiency * Count) / Total Load Watts
  const upsBackupHours = useMemo(() => {
    const totalWattHours = batteryAmps * batteryVoltage * batteryCount * (upsEfficiency / 100);
    if (auditSummary.totalWattageOn === 0) return 0;
    const backupHours = totalWattHours / auditSummary.totalWattageOn;
    return Number(backupHours.toFixed(1));
  }, [batteryAmps, batteryVoltage, batteryCount, upsEfficiency, auditSummary.totalWattageOn]);

  const handleAddAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: ApplianceItem = {
      id: Date.now().toString(),
      name: newName,
      category: newCategory,
      wattage: newWattage,
      hoursPerDay: newHours,
      quantity: newQty,
      isPeakUsage: newIsPeak,
      isHighEfficiencyInverter: newName.toLowerCase().includes('inverter'),
    };

    setAppliances([...appliances, newItem]);
    setNewName('');
  };

  const handleRemoveAppliance = (id: string) => {
    setAppliances(appliances.filter((a) => a.id !== id));
  };

  const handleUpdateAppliance = (id: string, field: keyof ApplianceItem, value: any) => {
    setAppliances(
      appliances.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Cpu className="w-4 h-4" />
            <span>Appliance Wattage Audit & UPS Backup Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Household Wattage Audit & Load Shedding Planner
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Audit power consumption for Inverter ACs, Donkee Water Pumps, Refrigerator, Ceiling Fans, and Lights. Calculate peak-hour penalty costs and UPS battery backup time!
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Appliance Inventory Builder */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Active Household Appliance List</span>
              </h2>
              <p className="text-xs text-slate-400">Customize wattage and usage hours per day</p>
            </div>
            <span className="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {appliances.length} Items
            </span>
          </div>

          {/* Add Custom Appliance Form */}
          <form onSubmit={handleAddAppliance} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3 text-xs">
            <span className="font-bold text-white block uppercase tracking-wider">Add Custom Appliance</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Appliance Name (e.g. Inverter AC)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-400"
              />

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
              >
                <option value="Cooling">Cooling (AC / Fan)</option>
                <option value="Heating">Heating (Geyser / Iron)</option>
                <option value="Kitchen">Kitchen (Fridge / Microwave)</option>
                <option value="Lighting">Lighting (Bulbs / Tube)</option>
                <option value="Motors">Motors (Water Pump)</option>
                <option value="Electronics">Electronics (TV / PC / UPS)</option>
              </select>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Watts"
                  value={newWattage}
                  onChange={(e) => setNewWattage(parseInt(e.target.value) || 0)}
                  className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold outline-none"
                />
                <button
                  type="submit"
                  className="w-1/2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </form>

          {/* Appliance Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Appliance</th>
                  <th className="pb-3">Wattage</th>
                  <th className="pb-3">Qty</th>
                  <th className="pb-3">Daily Hrs</th>
                  <th className="pb-3">Peak Window</th>
                  <th className="pb-3">Monthly Units</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {appliances.map((app) => {
                  const monthlyUnitsItem = Math.round(((app.wattage * app.hoursPerDay * app.quantity) / 1000) * 30);
                  return (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pl-2 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span>{app.name}</span>
                          {app.isHighEfficiencyInverter && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                              Inverter
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 font-mono">
                        <input
                          type="number"
                          value={app.wattage}
                          onChange={(e) => handleUpdateAppliance(app.id, 'wattage', parseInt(e.target.value) || 0)}
                          className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-white font-bold"
                        /> W
                      </td>

                      <td className="py-3 font-mono">
                        <input
                          type="number"
                          min="1"
                          value={app.quantity}
                          onChange={(e) => handleUpdateAppliance(app.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-12 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-white font-bold"
                        />
                      </td>

                      <td className="py-3 font-mono">
                        <input
                          type="number"
                          min="0.5"
                          max="24"
                          step="0.5"
                          value={app.hoursPerDay}
                          onChange={(e) => handleUpdateAppliance(app.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                          className="w-14 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-white font-bold"
                        /> hrs
                      </td>

                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => handleUpdateAppliance(app.id, 'isPeakUsage', !app.isPeakUsage)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            app.isPeakUsage
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {app.isPeakUsage ? 'Peak Hours' : 'Off-Peak'}
                        </button>
                      </td>

                      <td className="py-3 font-mono font-bold text-amber-400">
                        {monthlyUnitsItem} kWh
                      </td>

                      <td className="py-3 pr-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveAppliance(app.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Audit Summary & UPS Battery Backup Calculator */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Audit Results Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Audit Summary Output</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Daily kWh Consumption:</span>
                <span className="text-base font-extrabold text-white font-mono">{auditSummary.totalDailyKwh} kWh/day</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Monthly Total Units:</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">{auditSummary.totalMonthlyKwh} kWh</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Est. Monthly Electricity Cost:</span>
                <span className="text-lg font-black text-white font-mono">Rs {auditSummary.estimatedMonthlyCostPkr.toLocaleString()} PKR</span>
              </div>
            </div>

            {/* Peak Hours Shifting Alert */}
            {auditSummary.monthlyPeakExtraCostPkr > 0 && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <Clock className="w-4 h-4" />
                  <span>Peak Hours Extra Cost Penalty</span>
                </div>
                <p>
                  Running these appliances during peak hours adds approximately <strong>Rs {auditSummary.monthlyPeakExtraCostPkr.toLocaleString()} PKR</strong> extra to your bill per month!
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => onOpenAiCoachWithContext({
                totalMonthlyKwh: auditSummary.totalMonthlyKwh,
                estimatedCost: auditSummary.estimatedMonthlyCostPkr,
                appliancesCount: appliances.length
              })}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Ask AI Coach How to Trim Wattage</span>
            </button>
          </div>

          {/* UPS & Battery Backup Calculator Card */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-emerald-400" />
              <span>UPS / Inverter Load Shedding Backup</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Battery Ampere Rating (Ah)</label>
                <select
                  value={batteryAmps}
                  onChange={(e) => setBatteryAmps(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                >
                  <option value={100}>100 Ah (Small UPS Battery)</option>
                  <option value={150}>150 Ah (Medium Battery)</option>
                  <option value={200}>200 Ah (Standard Tall Tubular Battery)</option>
                  <option value={230}>230 Ah (Heavy Duty Battery)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Battery Count</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={batteryCount}
                    onChange={(e) => setBatteryCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Active Load (Watts)</label>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-bold font-mono text-center">
                    {auditSummary.totalWattageOn} W
                  </div>
                </div>
              </div>

              {/* Calculated Backup Time Result */}
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 text-center space-y-1">
                <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Estimated UPS Backup Time</span>
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  {upsBackupHours} Hours
                </span>
                <p className="text-[10px] text-slate-500">Based on 85% UPS inverter discharge efficiency</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
