'use client';

import { useState } from 'react';
// Button component inline
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }> = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`} {...props}>
    {children}
  </button>
);

interface TaxCalculation {
  totalIncome: number;
  taxableIncome: number;
  taxOwed: number;
  effectiveRate: number;
  marginalRate: number;
  deductions: {
    personal: number;
    dependents: number;
    other: number;
    total: number;
  };
}

export function IRPFCalculator() {
  const [income, setIncome] = useState<string>('');
  const [deductions, setDeductions] = useState<string>('');
  const [result, setResult] = useState<TaxCalculation | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateTax = async () => {
    if (!income || parseFloat(income) <= 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/irpf/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          income: parseFloat(income),
          deductions: parseFloat(deductions) || 0,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error al calcular IRPF:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-xl font-semibold mb-4">Calculadora IRPF Andorra</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="income" className="block text-sm font-medium mb-2">
                Ingresos Brutos Anuales (€)
              </label>
              <input
                type="number"
                id="income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="50000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="deductions" className="block text-sm font-medium mb-2">
                Deducciones (€)
              </label>
              <input
                type="number"
                id="deductions"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                placeholder="3000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <Button 
              onClick={calculateTax} 
              disabled={loading || !income}
              className="w-full"
            >
              {loading ? 'Calculando...' : 'Calcular IRPF'}
            </Button>
          </div>

          {result && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Resultado del Cálculo</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Ingresos Brutos:</span>
                  <span className="font-medium">{formatCurrency(result.totalIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deducciones:</span>
                  <span className="font-medium">{formatCurrency(result.deductions.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Imponible:</span>
                  <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipo Marginal:</span>
                  <span className="font-medium">{result.marginalRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipo Efectivo:</span>
                  <span className="font-medium">{result.effectiveRate}%</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>IRPF a pagar:</span>
                  <span className="text-red-600">{formatCurrency(result.taxOwed)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Ingresos Netos:</span>
                  <span className="text-green-600">{formatCurrency(result.totalIncome - result.taxOwed)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información sobre tarifas */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Tarifas IRPF Andorra 2024</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">Residentes:</p>
            <ul className="space-y-1">
              <li>• Hasta 24,000€: 0%</li>
              <li>• 24,001€ - 40,000€: 5%</li>
              <li>• Más de 40,000€: 10%</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Deducciones comunes:</p>
            <ul className="space-y-1">
              <li>• Mínimo personal: 24,000€</li>
              <li>• Por hijos: 3,000€/hijo</li>
              <li>• Discapacidad: 3,000€</li>
              <li>• Pensiones: Hasta 50,000€</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}