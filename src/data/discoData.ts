import { DiscoInfo, DiscoCode, BillCalculationParams, BillCalculationResult } from '../types';

export const DISCO_LIST: DiscoInfo[] = [
  {
    code: 'LESCO',
    name: 'LESCO',
    fullName: 'Lahore Electric Supply Company',
    city: 'Lahore',
    region: 'Lahore, Kasur, Okara, Sheikhupura, Nankana',
    contactNumber: '118 / 042-99204820',
    color: 'from-amber-500 to-orange-600',
    peakHours: '5:00 PM – 11:00 PM',
  },
  {
    code: 'KE',
    name: 'K-Electric',
    fullName: 'K-Electric Limited',
    city: 'Karachi',
    region: 'Karachi Metropolitan, Hub, Dhabeji, Gharo',
    contactNumber: '118 / 021-99000',
    color: 'from-blue-600 to-indigo-700',
    peakHours: '6:00 PM – 10:00 PM',
  },
  {
    code: 'IESCO',
    name: 'IESCO',
    fullName: 'Islamabad Electric Supply Company',
    city: 'Islamabad',
    region: 'Islamabad, Rawalpindi, Attock, Jhelum, Chakwal',
    contactNumber: '118 / 051-9252937',
    color: 'from-emerald-500 to-teal-700',
    peakHours: '5:00 PM – 11:00 PM',
  },
  {
    code: 'FESCO',
    name: 'FESCO',
    fullName: 'Faisalabad Electric Supply Company',
    city: 'Faisalabad',
    region: 'Faisalabad, Jhang, Toba Tek Singh, Chiniot, Sargodha',
    contactNumber: '118 / 041-9220184',
    color: 'from-cyan-500 to-blue-600',
    peakHours: '5:00 PM – 11:00 PM',
  },
  {
    code: 'MEPCO',
    name: 'MEPCO',
    fullName: 'Multan Electric Power Company',
    city: 'Multan',
    region: 'Multan, Sahiwal, D.G. Khan, Bahawalpur, Rahim Yar Khan',
    contactNumber: '118 / 061-9220313',
    color: 'from-violet-500 to-purple-700',
    peakHours: '5:00 PM – 11:00 PM',
  },
  {
    code: 'PESCO',
    name: 'PESCO',
    fullName: 'Peshawar Electric Supply Company',
    city: 'Peshawar',
    region: 'Peshawar, Mardan, Swat, Hazara, Bannu, Kohat',
    contactNumber: '118 / 091-9211997',
    color: 'from-rose-500 to-red-700',
    peakHours: '5:00 PM – 11:00 PM',
  },
  {
    code: 'HESCO',
    name: 'HESCO',
    fullName: 'Hyderabad Electric Supply Company',
    city: 'Hyderabad',
    region: 'Hyderabad, Thatta, Badin, Mirpurkhas, Nawabshah',
    contactNumber: '118 / 022-9260161',
    color: 'from-orange-500 to-amber-700',
    peakHours: '6:00 PM – 10:00 PM',
  },
  {
    code: 'SEPCO',
    name: 'SEPCO',
    fullName: 'Sukkur Electric Power Company',
    city: 'Sukkur',
    region: 'Sukkur, Larkana, Khairpur, Ghotki, Jacobabad',
    contactNumber: '118 / 071-9310798',
    color: 'from-teal-500 to-emerald-700',
    peakHours: '6:00 PM – 10:00 PM',
  },
  {
    code: 'QESCO',
    name: 'QESCO',
    fullName: 'Quetta Electric Supply Company',
    city: 'Quetta',
    region: 'Quetta, Kalat, Sibi, Zhob, Nasirabad, Makran',
    contactNumber: '118 / 081-9201750',
    color: 'from-sky-500 to-indigo-600',
    peakHours: '6:00 PM – 10:00 PM',
  },
  {
    code: 'GEBCO',
    name: 'GEBCO',
    fullName: 'Gilgit-Baltistan Electricity Dept',
    city: 'Gilgit',
    region: 'Gilgit, Skardu, Hunza, Ghizer, Diamer',
    contactNumber: '05811-920224',
    color: 'from-indigo-500 to-blue-800',
    peakHours: '5:00 PM – 11:00 PM',
  },
];

// NEPRA Slab Tariff Rates for Residential Consumers (PKR per kWh)
export function calculatePakistaniBill(params: BillCalculationParams): BillCalculationResult {
  const {
    units,
    consumerCategory,
    isThreePhase,
    peakUnits = 0,
    offPeakUnits = 0,
  } = params;

  let baseCost = 0;
  let activeSlabLabel = 'Default';
  let slabRatePerUnit = 0;
  let unitsToNextSlab = 0;
  let nextSlabRate = 0;
  let potentialSavingsSlabPkr = 0;

  if (isThreePhase) {
    // Time of Use (TOU) Rates
    const peakRate = 49.35;
    const offPeakRate = 35.50;
    const totalUnits = peakUnits + offPeakUnits || units;
    baseCost = (peakUnits * peakRate) + (offPeakUnits * offPeakRate);
    activeSlabLabel = `TOU 3-Phase (${peakUnits} Peak / ${offPeakUnits} Off-Peak)`;
    slabRatePerUnit = totalUnits > 0 ? baseCost / totalUnits : 42.0;
  } else {
    // Single Phase Slab System
    if (consumerCategory === 'protected') {
      if (units <= 100) {
        slabRatePerUnit = 11.69;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Protected Slab (1 - 100 Units)';
        unitsToNextSlab = 101 - units;
        nextSlabRate = 14.16;
      } else if (units <= 200) {
        slabRatePerUnit = 14.16;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Protected Slab (101 - 200 Units)';
        unitsToNextSlab = 201 - units;
        nextSlabRate = 23.59; // Crosses into Unprotected
        potentialSavingsSlabPkr = (units - 100) * (14.16 - 11.69);
      } else {
        // Automatically shifted to unprotected if > 200
        const effectiveUnits = units;
        if (effectiveUnits <= 300) {
          slabRatePerUnit = 34.26;
          activeSlabLabel = 'Unprotected Slab (201 - 300 Units)';
        } else if (effectiveUnits <= 400) {
          slabRatePerUnit = 39.15;
          activeSlabLabel = 'Unprotected Slab (301 - 400 Units)';
        } else if (effectiveUnits <= 500) {
          slabRatePerUnit = 41.36;
          activeSlabLabel = 'Unprotected Slab (401 - 500 Units)';
        } else if (effectiveUnits <= 600) {
          slabRatePerUnit = 42.78;
          activeSlabLabel = 'Unprotected Slab (501 - 600 Units)';
        } else if (effectiveUnits <= 700) {
          slabRatePerUnit = 43.92;
          activeSlabLabel = 'Unprotected Slab (601 - 700 Units)';
        } else {
          slabRatePerUnit = 48.84;
          activeSlabLabel = 'Unprotected Slab (> 700 Units)';
        }
        baseCost = effectiveUnits * slabRatePerUnit;
      }
    } else {
      // Unprotected Category Slabs
      if (units <= 100) {
        slabRatePerUnit = 23.59;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Unprotected Slab (1 - 100 Units)';
        unitsToNextSlab = 101 - units;
        nextSlabRate = 30.07;
      } else if (units <= 200) {
        slabRatePerUnit = 30.07;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Unprotected Slab (101 - 200 Units)';
        unitsToNextSlab = 201 - units;
        nextSlabRate = 34.26;
        potentialSavingsSlabPkr = (units - 100) * (30.07 - 23.59);
      } else if (units <= 300) {
        slabRatePerUnit = 34.26;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Unprotected Slab (201 - 300 Units)';
        unitsToNextSlab = 301 - units;
        nextSlabRate = 39.15;
        potentialSavingsSlabPkr = (units - 200) * (34.26 - 30.07);
      } else if (units <= 400) {
        slabRatePerUnit = 39.15;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Unprotected Slab (301 - 400 Units)';
        unitsToNextSlab = 401 - units;
        nextSlabRate = 41.36;
        potentialSavingsSlabPkr = (units - 300) * (39.15 - 34.26);
      } else if (units <= 500) {
        slabRatePerUnit = 41.36;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Unprotected Slab (401 - 500 Units)';
        unitsToNextSlab = 501 - units;
        nextSlabRate = 42.78;
      } else if (units <= 600) {
        slabRatePerUnit = 42.78;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Unprotected Slab (501 - 600 Units)';
        unitsToNextSlab = 601 - units;
        nextSlabRate = 43.92;
      } else if (units <= 700) {
        slabRatePerUnit = 43.92;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Unprotected Slab (601 - 700 Units)';
        unitsToNextSlab = 701 - units;
        nextSlabRate = 48.84;
      } else {
        slabRatePerUnit = 48.84;
        baseCost = units * slabRatePerUnit;
        activeSlabLabel = 'Unprotected Peak Slab (> 700 Units)';
      }
    }
  }

  // Surcharges & Taxes Calculation according to NEPRA / Federal Board of Revenue
  const totalUnitsCalculated = isThreePhase ? (peakUnits + offPeakUnits) : units;
  
  // Fuel Price Adjustment (FPA) estimated at Rs 3.20 per unit
  const fuelPriceAdjustmentPkr = Math.round(totalUnitsCalculated * 3.20);
  
  // FC Surcharge (Financing Cost Surcharge) at Rs 3.23 per unit
  const fcSurchargePkr = Math.round(totalUnitsCalculated * 3.23);
  
  // Electricity Duty (1.5% of base bill)
  const electricityDutyPkr = Math.round(baseCost * 0.015);
  
  // PTV Fee (Rs 35 fixed per domestic connection)
  const tvFeePkr = 35;
  
  // Taxable subtotal
  const taxableSubtotal = baseCost + fuelPriceAdjustmentPkr + fcSurchargePkr + electricityDutyPkr;
  
  // Sales Tax / GST (18%)
  const gstPkr = Math.round(taxableSubtotal * 0.18);
  
  // Income tax / Extra taxes for higher consumption (> Rs 25,000 bill)
  const incomeTaxPkr = (baseCost + gstPkr) > 25000 ? Math.round((baseCost + gstPkr) * 0.075) : 0;
  const extraTaxesPkr = Math.round(totalUnitsCalculated * 0.50);

  const totalBillPkr = Math.round(
    baseCost + 
    fuelPriceAdjustmentPkr + 
    fcSurchargePkr + 
    electricityDutyPkr + 
    tvFeePkr + 
    gstPkr + 
    incomeTaxPkr + 
    extraTaxesPkr
  );

  const averageCostPerUnitPkr = totalUnitsCalculated > 0 ? Number((totalBillPkr / totalUnitsCalculated).toFixed(2)) : 0;

  const breakdown = [
    {
      label: 'Base Electricity Energy Cost',
      amountPkr: Math.round(baseCost),
      percentage: Number(((baseCost / totalBillPkr) * 100).toFixed(1)),
      description: `Units charged at slab rate Rs ${slabRatePerUnit.toFixed(2)}/kWh`,
    },
    {
      label: 'Fuel Price Adjustment (FPA)',
      amountPkr: fuelPriceAdjustmentPkr,
      percentage: Number(((fuelPriceAdjustmentPkr / totalBillPkr) * 100).toFixed(1)),
      description: 'Monthly fuel price variation surcharge by NEPRA',
    },
    {
      label: 'FC Surcharge',
      amountPkr: fcSurchargePkr,
      percentage: Number(((fcSurchargePkr / totalBillPkr) * 100).toFixed(1)),
      description: 'Financing Cost Surcharge (Rs 3.23/unit)',
    },
    {
      label: 'GST / Sales Tax (18%)',
      amountPkr: gstPkr,
      percentage: Number(((gstPkr / totalBillPkr) * 100).toFixed(1)),
      description: '18% Federal Sales Tax on power bill',
    },
    {
      label: 'Duties & Fixed Fees (TV, ED, Tax)',
      amountPkr: electricityDutyPkr + tvFeePkr + incomeTaxPkr + extraTaxesPkr,
      percentage: Number((((electricityDutyPkr + tvFeePkr + incomeTaxPkr + extraTaxesPkr) / totalBillPkr) * 100).toFixed(1)),
      description: 'PTV Fee Rs 35, Electricity Duty 1.5%, Income Tax & surcharges',
    },
  ];

  return {
    baseCostPkr: Math.round(baseCost),
    variableChargesPkr: Math.round(baseCost),
    fuelPriceAdjustmentPkr,
    fcSurchargePkr,
    electricityDutyPkr,
    tvFeePkr,
    gstPkr,
    incomeTaxPkr,
    extraTaxesPkr,
    totalBillPkr,
    averageCostPerUnitPkr,
    activeSlabLabel,
    slabRatePerUnit,
    unitsToNextSlab,
    nextSlabRate,
    potentialSavingsSlabPkr,
    breakdown,
  };
}

// Preset Common Pakistani Household Appliances
export const SAMPLE_APPLIANCES = [
  { id: '1', name: '1.5 Ton DC Inverter AC (26°C Eco)', category: 'Cooling', wattage: 1100, hoursPerDay: 8, quantity: 1, isPeakUsage: false, isHighEfficiencyInverter: true },
  { id: '2', name: '1.5 Ton Non-Inverter AC', category: 'Cooling', wattage: 1800, hoursPerDay: 8, quantity: 1, isPeakUsage: true, isHighEfficiencyInverter: false },
  { id: '3', name: 'DC Inverter Refrigerator', category: 'Kitchen', wattage: 180, hoursPerDay: 24, quantity: 1, isPeakUsage: false, isHighEfficiencyInverter: true },
  { id: '4', name: 'Water Motor / Donkee Pump (1 HP)', category: 'Motors', wattage: 750, hoursPerDay: 1, quantity: 1, isPeakUsage: true, isHighEfficiencyInverter: false },
  { id: '5', name: 'Ceiling Fan (Standard AC)', category: 'Cooling', wattage: 80, hoursPerDay: 14, quantity: 4, isPeakUsage: true, isHighEfficiencyInverter: false },
  { id: '6', name: 'BLDC Solar Inverter Ceiling Fan', category: 'Cooling', wattage: 35, hoursPerDay: 14, quantity: 4, isPeakUsage: false, isHighEfficiencyInverter: true },
  { id: '7', name: 'LED Bulbs (12W)', category: 'Lighting', wattage: 12, hoursPerDay: 6, quantity: 8, isPeakUsage: true, isHighEfficiencyInverter: true },
  { id: '8', name: 'Automatic Washing Machine', category: 'Electronics', wattage: 500, hoursPerDay: 1, quantity: 1, isPeakUsage: false, isHighEfficiencyInverter: true },
  { id: '9', name: 'Microwave Oven (1000W)', category: 'Kitchen', wattage: 1200, hoursPerDay: 0.5, quantity: 1, isPeakUsage: true, isHighEfficiencyInverter: false },
  { id: '10', name: 'Electric Clothes Iron (Istri)', category: 'Heating', wattage: 1000, hoursPerDay: 1, quantity: 1, isPeakUsage: true, isHighEfficiencyInverter: false },
  { id: '11', name: 'UPS Charging / Inverter Idle', category: 'Electronics', wattage: 150, hoursPerDay: 12, quantity: 1, isPeakUsage: false, isHighEfficiencyInverter: false },
];
