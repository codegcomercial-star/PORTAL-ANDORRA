import { NextRequest, NextResponse } from 'next/server';
import type { 
  IRPFCalculationInput, 
  IRPFCalculationResult 
} from '../../../../types/irpf';
import { 
  ANDORRA_IRPF_BRACKETS, 
  ANDORRA_DEDUCTIONS 
} from '../../../../types/irpf';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { 
    year = 2024,
    residency = 'RESIDENT',
    income = 0,
    incomeBreakdown = {},
    dependents = 0,
    deductions = 0
  } = body;

  // Mock IRPF calculation
  const totalIncome = income || Object.values(incomeBreakdown).reduce((sum: number, value: any) => sum + (value || 0), 0);
  const personalDeduction = 24000; // Base personal deduction for Andorra
  const dependentsDeduction = dependents * 6000;
  const otherDeductions = typeof deductions === 'number' ? deductions : Object.values(deductions || {}).reduce((sum: number, value: any) => sum + (Number(value) || 0), 0);
  
  const taxableIncome = Math.max(0, totalIncome - personalDeduction - dependentsDeduction - otherDeductions);
  
  // Andorra IRPF brackets (simplified)
  let taxOwed = 0;
  if (taxableIncome > 40000) {
    taxOwed += (taxableIncome - 40000) * 0.10;
    taxOwed += 16000 * 0.05;
  } else if (taxableIncome > 24000) {
    taxOwed += (taxableIncome - 24000) * 0.05;
  }
  
  const effectiveRate = totalIncome > 0 ? (taxOwed / totalIncome) * 100 : 0;
  const marginalRate = taxableIncome > 40000 ? 10 : taxableIncome > 24000 ? 5 : 0;

  const result = {
    year,
    residency,
    totalIncome,
    deductions: {
      personal: personalDeduction,
      dependents: dependentsDeduction,
      other: otherDeductions,
      total: personalDeduction + dependentsDeduction + Number(otherDeductions),
    },
    taxableIncome,
    taxOwed: Math.round(taxOwed * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    marginalRate,
    breakdown: incomeBreakdown,
    calculatedAt: new Date().toISOString(),
  };

  return NextResponse.json(result);
}