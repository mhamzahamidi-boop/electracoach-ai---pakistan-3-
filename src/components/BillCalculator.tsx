import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  TrendingDown, 
  Info, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import { DiscoCode, ConsumerCategory } from '../types';
import { DISCO_LIST, calculatePakistaniBill } from '../data/discoData';

interface BillCalculatorProps {
  selectedDisco: DiscoCode;
  setSelectedDisco: (disco: DiscoCode) => void;
  language: 'EN' | 'UR' | 'RU';
  onNavigateToSolar: () => void;
  onNavigateToScan: () => void;
  onOpenAiCoachWithContext: (context: any) => void;
}

export const BillCalculator: React.FC<BillCalculatorProps> = ({
  selectedDisco,
  setSelectedDisco,
  language,
  onNavigateToSolar,
  onNavigateToScan,
  onOpenAiCoachWithContext,
}) => {
  const [units, setUnits] = useState<number>(350);
  const [consumerCategory, setConsumerCategory] = useState<ConsumerCategory>('unprotected');
  const [isThreePhase, setIsThreePhase] = useState<boolean>(false);
  const [peakUnits, setPeakUnits] = useState<number>(80);
  const [offPeakUnits, setOffPeakUnits] = useState<number>(270);

  const discoObj = DISCO_LIST.find((d) => d.code === selectedDisco) || DISCO_LIST[0];

  const calculationResult = useMemo(() => {
    return calculatePakistaniBill({
      disco: selectedDisco,
      units,
      consumerCategory,
      isThreePhase,
      peakUnits,
      offPeakUnits,
    });
  }, [selectedDisco, units, consumerCategory, isThreePhase, peakUnits, offPeakUnits]);

  // Handle unit slider / quick buttons
  const setQuickUnits = (val: number) => {
    setUnits(val);
    if (isThreePhase) {
      setPeakUnits(Math.round(val * 0.25));
      setOffPeakUnits(Math.round(val * 0.75));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>2025/2026 NEPRA Tariff & Tax Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Calculate Your Electricity Bill for <span className="text-amber-400 underline decoration-amber-500/40">{discoObj.fullName}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Instantly compute base energy costs, Fuel Price Adjustment (FPA), FC Surcharge, 18% GST, Electricity Duty, and Protected/Unprotected slab rates across Pakistan.
            </p>
          </div>

          <div className="lg:col-span-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Selected DISCO:</span>
              <span className="font-bold text-amber-400">{discoObj.name} ({discoObj.city})</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Peak Hours Today:</span>
              <span className="font-bold text-rose-400">{discoObj.peakHours}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Emergency Helpline:</span>
              <span className="font-mono text-emerald-400 font-bold">{discoObj.contactNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Meter & Usage Settings</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">NEPRA Approved</span>
          </div>

          {/* DISCO Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Power Distribution Company (DISCO)
            </label>
            <select
              value={selectedDisco}
              onChange={(e) => setSelectedDisco(e.target.value as DiscoCode)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {DISCO_LIST.map((disco) => (
                <option key={disco.code} value={disco.code}>
                  {disco.name} – {disco.fullName} ({disco.city})
                </option>
              ))}
            </select>
          </div>

          {/* Connection Type Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Meter Tariff Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsThreePhase(false)}
                className={`py-2.5 px-3 rounded-lg transition-all ${
                  !isThreePhase
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Single Phase (Slab)
              </button>
              <button
                type="button"
                onClick={() => setIsThreePhase(true)}
                className={`py-2.5 px-3 rounded-lg transition-all ${
                  isThreePhase
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3-Phase TOU (Peak/Off-Peak)
              </button>
            </div>
          </div>

          {/* Protected Category Selector (Only for Single Phase) */}
          {!isThreePhase && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Consumer Slab Status
                </label>
                <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Max 200 units/mo for 6 months
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setConsumerCategory('protected')}
                  className={`py-2.5 px-3 rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                    consumerCategory === 'protected'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Protected Category</span>
                  <span className="text-[10px] opacity-80">(Subsidized Slabs)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsumerCategory('unprotected')}
                  className={`py-2.5 px-3 rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                    consumerCategory === 'unprotected'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Unprotected Category</span>
                  <span className="text-[10px] opacity-80">(Standard Tariff)</span>
                </button>
              </div>
              {units > 200 && consumerCategory === 'protected' && (
                <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Units exceed 200. NEPRA rules automatically shift billing to Unprotected slab.</span>
                </p>
              )}
            </div>
          )}

          {/* Units Input Section */}
          {!isThreePhase ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Units Consumed (kWh)
                </label>
                <div className="flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  <input
                    type="number"
                    min="1"
                    max="3000"
                    value={units}
                    onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-20 bg-transparent text-amber-400 text-right font-extrabold text-lg outline-none"
                  />
                  <span className="text-xs text-slate-400">units</span>
                </div>
              </div>

              <input
                type="range"
                min="50"
                max="1000"
                step="10"
                value={units}
                onChange={(e) => setUnits(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />

              {/* Quick preset chips */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {[100, 200, 300, 400, 500, 700, 1000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuickUnits(preset)}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      units === preset
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/50'
                    }`}
                  >
                    {preset} Units
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* 3-Phase TOU Peak / Off-Peak Inputs */
            <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-rose-400" />
                <span>
                  <strong>{discoObj.name} Peak Hours:</strong> {discoObj.peakHours} (Charged at ~Rs 49.35/unit)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-rose-300 font-medium block">Peak Units</label>
                  <input
                    type="number"
                    min="0"
                    value={peakUnits}
                    onChange={(e) => setPeakUnits(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm outline-none focus:border-rose-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-emerald-300 font-medium block">Off-Peak Units</label>
                  <input
                    type="number"
                    min="0"
                    value={offPeakUnits}
                    onChange={(e) => setOffPeakUnits(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">Total Units: {peakUnits + offPeakUnits} kWh</p>
            </div>
          )}

          {/* Quick Action Shortcuts */}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onOpenAiCoachWithContext({
                disco: selectedDisco,
                units,
                totalBillPkr: calculationResult.totalBillPkr,
                slab: calculationResult.activeSlabLabel
              })}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:scale-[1.01] transition-transform"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Ask AI Coach How to Reduce This Bill</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToScan}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <span>Scan Physical Electricity Bill (Gemini OCR)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Bill Calculation Results & Tax Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Total Bill Summary Card */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                  Estimated Total Payable Bill
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    Rs {calculationResult.totalBillPkr.toLocaleString()}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    PKR
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Effective Unit Rate</span>
                <span className="text-lg font-bold text-amber-400 font-mono">
                  Rs {calculationResult.averageCostPerUnitPkr} / kWh
                </span>
                <span className="text-[10px] text-slate-500 block">(Includes all taxes & FPA)</span>
              </div>
            </div>

            {/* Slab Badge Banner */}
            <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-slate-300 font-medium">Active NEPRA Tariff Slab:</span>
                <span className="font-extrabold text-amber-400">{calculationResult.activeSlabLabel}</span>
              </div>
              <span className="text-slate-400 font-mono">
                Base Rate: <strong>Rs {calculationResult.slabRatePerUnit.toFixed(2)}/unit</strong>
              </span>
            </div>

            {/* Next Slab Warning / Opportunity Alert */}
            {calculationResult.unitsToNextSlab > 0 && calculationResult.unitsToNextSlab <= 30 && (
              <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Slab Boundary Alert!</strong> You are only <strong>{calculationResult.unitsToNextSlab} units</strong> away from crossing into the higher tariff slab (Rs {calculationResult.nextSlabRate?.toFixed(2)}/unit). Keep usage below this threshold to avoid steep price jumps!
                </div>
              </div>
            )}

            {/* Print / Export Button */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handlePrint}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill Summary</span>
              </button>
            </div>
          </div>

          {/* Tax & Surcharge Breakdown Visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Complete Bill Itemization (Taxes & Surcharges)</span>
              <span className="text-xs font-mono text-slate-400">{discoObj.name} Official Structure</span>
            </h3>

            {/* Stacked Cost Bar Chart */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                <div 
                  style={{ width: `${calculationResult.breakdown[0].percentage}%` }}
                  className="bg-amber-500 h-full rounded-l-full transition-all duration-500" 
                  title="Base Electricity"
                />
                <div 
                  style={{ width: `${calculationResult.breakdown[1].percentage}%` }}
                  className="bg-blue-500 h-full transition-all duration-500" 
                  title="Fuel Price Adjustment"
                />
                <div 
                  style={{ width: `${calculationResult.breakdown[2].percentage}%` }}
                  className="bg-violet-500 h-full transition-all duration-500" 
                  title="FC Surcharge"
                />
                <div 
                  style={{ width: `${calculationResult.breakdown[3].percentage}%` }}
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  title="GST (18%)"
                />
                <div 
                  style={{ width: `${calculationResult.breakdown[4].percentage}%` }}
                  className="bg-rose-500 h-full rounded-r-full transition-all duration-500" 
                  title="Duties & TV Fee"
                />
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-300 font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Base Energy ({calculationResult.breakdown[0].percentage}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  FPA ({calculationResult.breakdown[1].percentage}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  FC Surcharge ({calculationResult.breakdown[2].percentage}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  GST 18% ({calculationResult.breakdown[3].percentage}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Fixed Duties ({calculationResult.breakdown[4].percentage}%)
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between items-center font-medium text-slate-300">
                <div>
                  <p className="font-semibold text-white">Variable Base Energy Cost</p>
                  <p className="text-[11px] text-slate-400">Electricity consumed @ Rs {calculationResult.slabRatePerUnit.toFixed(2)}/unit</p>
                </div>
                <span className="font-mono font-bold text-white text-sm">Rs {calculationResult.baseCostPkr.toLocaleString()}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center font-medium text-slate-300">
                <div>
                  <p className="font-semibold text-white">Fuel Price Adjustment (FPA)</p>
                  <p className="text-[11px] text-slate-400">Monthly NEPRA fuel variation charge (~Rs 3.20/unit)</p>
                </div>
                <span className="font-mono font-bold text-blue-400 text-sm">Rs {calculationResult.fuelPriceAdjustmentPkr.toLocaleString()}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center font-medium text-slate-300">
                <div>
                  <p className="font-semibold text-white">Financing Cost (FC) Surcharge</p>
                  <p className="text-[11px] text-slate-400">Fixed power sector surcharge (Rs 3.23/unit)</p>
                </div>
                <span className="font-mono font-bold text-violet-400 text-sm">Rs {calculationResult.fcSurchargePkr.toLocaleString()}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center font-medium text-slate-300">
                <div>
                  <p className="font-semibold text-white">GST / Sales Tax (18%)</p>
                  <p className="text-[11px] text-slate-400">Federal Sales Tax on electricity & surcharges</p>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">Rs {calculationResult.gstPkr.toLocaleString()}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center font-medium text-slate-300">
                <div>
                  <p className="font-semibold text-white">PTV Fee + Electricity Duty + Income Tax</p>
                  <p className="text-[11px] text-slate-400">PTV License Fee (Rs 35) + ED (1.5%) + Advance Tax</p>
                </div>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  Rs {(calculationResult.electricityDutyPkr + calculationResult.tvFeePkr + calculationResult.incomeTaxPkr + calculationResult.extraTaxesPkr).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Solar Suggestion Banner */}
            {calculationResult.totalBillPkr >= 15000 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <TrendingDown className="w-4 h-4" />
                    <span>High Monthly Bill Detected ({calculationResult.totalBillPkr.toLocaleString()} PKR)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Installing a solar system can cut this bill down to zero or net-metering credit!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToSolar}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap shadow-md"
                >
                  Calculate Solar Net Metering ROI
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
