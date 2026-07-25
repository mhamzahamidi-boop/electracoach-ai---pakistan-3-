export type DiscoCode = 
  | 'LESCO' 
  | 'KE' 
  | 'IESCO' 
  | 'FESCO' 
  | 'MEPCO' 
  | 'PESCO' 
  | 'HESCO' 
  | 'SEPCO' 
  | 'QESCO' 
  | 'GEBCO';

export interface DiscoInfo {
  code: DiscoCode;
  name: string;
  fullName: string;
  city: string;
  region: string;
  contactNumber: string;
  color: string;
  peakHours: string;
}

export type ConsumerCategory = 'protected' | 'unprotected';

export interface BillCalculationParams {
  disco: DiscoCode;
  units: number;
  consumerCategory: ConsumerCategory;
  isThreePhase: boolean;
  peakUnits?: number;
  offPeakUnits?: number;
  sanctionedLoadKw?: number;
}

export interface BillCalculationResult {
  baseCostPkr: number;
  variableChargesPkr: number;
  fuelPriceAdjustmentPkr: number;
  fcSurchargePkr: number;
  electricityDutyPkr: number;
  tvFeePkr: number;
  gstPkr: number;
  incomeTaxPkr: number;
  extraTaxesPkr: number;
  totalBillPkr: number;
  averageCostPerUnitPkr: number;
  activeSlabLabel: string;
  slabRatePerUnit: number;
  unitsToNextSlab?: number;
  nextSlabRate?: number;
  potentialSavingsSlabPkr?: number;
  breakdown: Array<{
    label: string;
    amountPkr: number;
    percentage: number;
    description: string;
  }>;
}

export interface ApplianceItem {
  id: string;
  name: string;
  category: 'Cooling' | 'Heating' | 'Lighting' | 'Electronics' | 'Kitchen' | 'Motors';
  wattage: number;
  hoursPerDay: number;
  quantity: number;
  isPeakUsage: boolean;
  isHighEfficiencyInverter: boolean;
}

export interface ScannedBillResult {
  disco?: string;
  billingMonth?: string;
  referenceNumber?: string;
  unitsConsumed?: number;
  isProtected?: boolean;
  peakUnits?: number;
  offPeakUnits?: number;
  currentBillAmount?: number;
  totalAmountDue?: number;
  dueDate?: string;
  fuelPriceAdjustment?: number;
  totalTaxes?: number;
  keyObservations: string[];
  savingsRecommendations: string[];
  rawResponse?: string;
}

export interface SolarCalculationResult {
  recommendedCapacityKw: number;
  numberOfPanels: number;
  panelWattageEach: number;
  inverterType: string;
  batteryCapacity: string;
  estimatedCostMinPkr: number;
  estimatedCostMaxPkr: number;
  monthlyGenerationKwh: number;
  monthlyBillAfterSolarPkr: number;
  monthlySavingsPkr: number;
  annualSavingsPkr: number;
  paybackPeriodMonths: number;
  netMeteringBuybackRatePkr: number;
  customAdvice: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
