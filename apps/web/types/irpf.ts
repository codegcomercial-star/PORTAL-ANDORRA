// Tipos específicos para el IRPF Simulator

export interface IRPFBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface IRPFDeductions {
  personal: number;
  spouse?: number;
  children?: number;
  elderly?: number;
  disability?: number;
}

export interface IRPFCalculationInput {
  grossIncome: number;
  deductions?: Partial<IRPFDeductions>;
  filingStatus: 'single' | 'married' | 'head_of_household';
  children?: number;
  age?: number;
}

export interface IRPFCalculationResult {
  grossIncome: number;
  taxableIncome: number;
  totalDeductions: number;
  taxOwed: number;
  effectiveRate: number;
  marginalRate: number;
  netIncome: number;
  breakdown?: IRPFTaxBreakdown[];
}

export interface IRPFTaxBreakdown {
  bracket: IRPFBracket;
  taxableAmount: number;
  taxAmount: number;
}

// Constantes del IRPF andorrano
export const ANDORRA_IRPF_BRACKETS: IRPFBracket[] = [
  { min: 0, max: 24000, rate: 0 },
  { min: 24000, max: 40000, rate: 0.05 },
  { min: 40000, max: null, rate: 0.10 }
];

export const ANDORRA_DEDUCTIONS: IRPFDeductions = {
  personal: 9000,
  spouse: 9000,
  children: 3000,
  elderly: 1500,
  disability: 3000
};