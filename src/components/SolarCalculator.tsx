import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  Zap, 
  TrendingDown, 
  BatteryCharging, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Building, 
  ShieldCheck, 
  RefreshCw,
  Info
} from 'lucide-react';
import { DiscoCode } from '../types';

interface SolarCalculatorProps {
  selectedDisco: DiscoCode;
  onOpenAiCoachWithContext: (context: any) => void;
}

const CITIES_LIST = [
  'Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Rawalpindi', 
  'Gujranwala', 'Hyderabad', 'Sukkur', 'Sialkot'
];

export const SolarCalculator: React.FC<SolarCalculatorProps> = ({
  selectedDisco,
  onOpenAiCoachWithContext,
}) => {
  const [monthlyUnits, setMonthlyUnits] = useState<number>(600);
  const [city, setCity] = useState<string>('Lahore');
  const [systemType, setSystemType] = useState<'hybrid' | 'ongrid' | 'offgrid'>('hybrid');
  const [roofAreaSqFt, setRoofAreaSqFt] = useState<number>(900);
  const [isGeneratingAiProposal, setIsGeneratingAiProposal] = useState<boolean>(false);
  const [aiCustomAdvice, setAiCustomAdvice] = useState<string[] | null>(null);

  // Dynamic Math Calculation based on Pakistani Market Data
  const solarDetails = useMemo(() => {
    // 1 kW solar generates ~120 - 130 units per month in Pakistan
    const unitsPerKwMonthly = 125;
    const requiredKw = Math.max(3, Math.ceil(monthlyUnits / unitsPerKwMonthly));
    
    // Panel calculations: 585W Tier-1 N-Type Panels
    const panelWattage = 585;
    const numberOfPanels = Math.ceil((requiredKw * 1000) / panelWattage);

    // Estimated costs in PKR (Market average ~Rs 130,000 to Rs 160,000 per kW complete turnkey)
    let minCostPerKw = 135000;
    let maxCostPerKw = 165000;

    if (systemType === 'hybrid') {
      minCostPerKw += 30000; // Batteries and hybrid inverter
      maxCostPerKw += 45000;
    }

    const estimatedCostMinPkr = requiredKw * minCostPerKw;
    const estimatedCostMaxPkr = requiredKw * maxCostPerKw;

    const monthlyGenerationKwh = Math.round(requiredKw * unitsPerKwMonthly);
    const averageTariffPerUnit = 42.0; // Average per unit cost in Pakistan after taxes
    const monthlySavingsPkr = Math.round(monthlyGenerationKwh * averageTariffPerUnit);
    const annualSavingsPkr = monthlySavingsPkr * 12;

    const avgCostPkr = (estimatedCostMinPkr + estimatedCostMaxPkr) / 2;
    const paybackPeriodMonths = Math.round((avgCostPkr / monthlySavingsPkr));
    const paybackYears = Number((paybackPeriodMonths / 12).toFixed(1));

    return {
      requiredKw,
      numberOfPanels,
      panelWattage,
      estimatedCostMinPkr,
      estimatedCostMaxPkr,
      monthlyGenerationKwh,
      monthlySavingsPkr,
      annualSavingsPkr,
      paybackPeriodMonths,
      paybackYears,
      netMeteringRatePkr: 22.50,
      inverterSpecs: `${requiredKw}kW ${systemType === 'hybrid' ? 'Hybrid (Solar + Grid + Battery)' : 'On-Grid 3-Phase'} Inverter`,
      batterySpecs: systemType === 'hybrid' ? '10kWh Lithium LiFePO4 or 4x 200Ah Tall Tubular' : 'N/A (Grid Tied)',
    };
  }, [monthlyUnits, systemType]);

  // Request AI Custom Proposal from Backend Route
  const handleGenerateAiProposal = async () => {
    setIsGeneratingAiProposal(true);
    try {
      const response = await fetch('/api/ai/solar-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyUnits,
          city,
          roofAreaSqFt,
          systemType,
        }),
      });
      const data = await response.json();
      if (data.success && data.data?.customAdvice) {
        setAiCustomAdvice(data.data.customAdvice);
      }
    } catch (err) {
      console.warn('AI Solar API failed, providing local advice:', err);
      setAiCustomAdvice([
        `In ${city}, South-facing panels tilted at 30° angle maximize winter and summer power yield by ~18%.`,
        `Net Metering application with ${selectedDisco} typically takes 3-5 weeks following NEPRA SOPs.`,
        `Choose Tier-1 Mono PERC or N-Type TOPCon panels with 25-year performance warranty.`
      ]);
    } finally {
      setIsGeneratingAiProposal(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sun className="w-4 h-4 fill-amber-400" />
            <span>Pakistan Solar Net Metering Sizing & Payback Guide</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cut Your Electricity Bill to <span className="text-amber-400">Zero PKR</span> with Solar
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Calculate exact solar system size (kW), panel counts, hybrid battery backup for load shedding, net metering buyback credit rates, and full payback period for homes in Pakistan.
          </p>
        </div>
      </div>

      {/* Main Solar Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <span>Solar System Parameters</span>
            </h2>
            <span className="text-xs text-amber-400 font-medium">NEPRA Net Metering</span>
          </div>

          {/* Average Units / Bill */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Average Monthly Consumption (Units)
              </label>
              <div className="flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                <input
                  type="number"
                  min="100"
                  max="5000"
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(Math.max(50, parseInt(e.target.value) || 0))}
                  className="w-20 bg-transparent text-amber-400 text-right font-bold text-base outline-none"
                />
                <span className="text-xs text-slate-400">kWh</span>
              </div>
            </div>

            <input
              type="range"
              min="150"
              max="2000"
              step="25"
              value={monthlyUnits}
              onChange={(e) => setMonthlyUnits(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            
            <p className="text-xs text-slate-400 flex justify-between">
              <span>Approx Monthly Bill:</span>
              <strong className="text-white">Rs {(monthlyUnits * 42).toLocaleString()} PKR</strong>
            </p>
          </div>

          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              City / Location in Pakistan
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* System Architecture */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Solar Architecture
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSystemType('hybrid')}
                className={`py-2.5 px-3 rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                  systemType === 'hybrid'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Hybrid Solar System</span>
                <span className="text-[10px] opacity-80">(Net Meter + Battery Backup)</span>
              </button>

              <button
                type="button"
                onClick={() => setSystemType('ongrid')}
                className={`py-2.5 px-3 rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                  systemType === 'ongrid'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>On-Grid Net Metering</span>
                <span className="text-[10px] opacity-80">(Grid Export • No Battery)</span>
              </button>
            </div>
          </div>

          {/* Roof Area Space */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">
                Roof Area Space (Sq. Ft.)
              </label>
              <span className="text-amber-400 font-bold">{roofAreaSqFt} sq ft</span>
            </div>
            <input
              type="range"
              min="300"
              max="3000"
              step="50"
              value={roofAreaSqFt}
              onChange={(e) => setRoofAreaSqFt(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* AI Custom Proposal Trigger */}
          <button
            type="button"
            onClick={handleGenerateAiProposal}
            disabled={isGeneratingAiProposal}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-transform disabled:opacity-50"
          >
            {isGeneratingAiProposal ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Generating Gemini AI Proposal...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Generate Gemini AI Solar Proposal</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Solar ROI Output & Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main System Capacity Card */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                  Recommended System Capacity
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                    {solarDetails.requiredKw} kW
                  </span>
                  <span className="text-xs text-slate-300 font-semibold bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    Solar Capacity
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Estimated Turnkey Cost</span>
                <span className="text-lg font-extrabold text-white font-mono">
                  Rs {(solarDetails.estimatedCostMinPkr / 100000).toFixed(1)} Lakh – {(solarDetails.estimatedCostMaxPkr / 100000).toFixed(1)} Lakh
                </span>
                <span className="text-[10px] text-slate-400 block">(Turnkey installation including Net Metering)</span>
              </div>
            </div>

            {/* Key Performance Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Tier-1 Solar Panels</span>
                <span className="text-base font-extrabold text-white font-mono">
                  {solarDetails.numberOfPanels} Panels
                </span>
                <span className="text-[10px] text-slate-500 block">585W N-Type PERC</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Monthly Generation</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  ~{solarDetails.monthlyGenerationKwh} kWh
                </span>
                <span className="text-[10px] text-slate-500 block">Units per month</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Monthly Bill Savings</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  Rs {solarDetails.monthlySavingsPkr.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">PKR / month</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Payback Period</span>
                <span className="text-base font-extrabold text-sky-400 font-mono">
                  {solarDetails.paybackYears} Years
                </span>
                <span className="text-[10px] text-slate-500 block">~{solarDetails.paybackPeriodMonths} Months ROI</span>
              </div>
            </div>

            {/* Hardware & Battery Backup Specs */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <Zap className="w-4 h-4 text-amber-400" /> Inverter Specification:
                </span>
                <span className="font-mono text-amber-400 font-bold">{solarDetails.inverterSpecs}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <BatteryCharging className="w-4 h-4 text-emerald-400" /> Battery Storage for Load Shedding:
                </span>
                <span className="font-mono text-emerald-400 font-bold">{solarDetails.batterySpecs}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <TrendingDown className="w-4 h-4 text-sky-400" /> Net Metering Export Buyback Rate:
                </span>
                <span className="font-mono text-sky-400 font-bold">Rs {solarDetails.netMeteringRatePkr} / kWh</span>
              </div>
            </div>

          </div>

          {/* AI Custom Advice Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Solar Optimization Advice for {city} & {selectedDisco}</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              {aiCustomAdvice ? (
                aiCustomAdvice.map((adv, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Roof Orientation: Ensure panels face True South at a 30° to 35° tilt angle for optimal year-round generation in {city}.</span>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Net Metering Process: {selectedDisco} requires a 3-phase green meter installation, test report submission, and NEPRA generation license.</span>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Load Shedding Backup: With {solarDetails.requiredKw}kW hybrid capacity, your entire home (fans, lights, inverter ACs) will run uninterrupted during power cuts!</span>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => onOpenAiCoachWithContext({
                solarKw: solarDetails.requiredKw,
                monthlyUnits,
                city,
                estimatedCost: solarDetails.estimatedCostMinPkr
              })}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <span>Ask AI Coach for Solar Vendor & Licensing Guidance</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
