
import React, { useState, useEffect } from 'react';
import { Calculator } from './components/Calculator';
import { Results } from './components/Results';
import { TaxResult, TransactionType, CalculatorState } from './types';
import { calculateTax } from './services/taxUtils';
import { Calculator as CalcIcon, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    grossAmount: 0,
    hasNpwp: true,
    isTreasurer: false, // Default to general retail (not treasurer)
    transactionType: TransactionType.GOODS, // Default Goods
    ppnRate: 11,
    pphRate: 0, // Will be set automatically based on type
    customPphRate: null,
  });

  const [result, setResult] = useState<TaxResult | null>(null);

  // Effect to set default PPh rates when transaction type changes
  useEffect(() => {
    setState(prevState => {
      let newPphRate = 0;
      
      if (prevState.customPphRate !== null) {
        // 1. Manual Override takes precedence
        newPphRate = prevState.customPphRate;
      } else {
        if (prevState.transactionType === TransactionType.SERVICES) {
          // 2. Services: Always PPh 23 logic (2% w/ NPWP, 4% w/o)
          // Even for Treasurer (WAPU), the rate is PPh 23, just the payment flow changes.
          newPphRate = prevState.hasNpwp ? 2 : 4;
        } else {
          // 3. Goods: PPh 22 Logic
          // If selling to Treasurer/BUMN (Pemungut), rate is 1.5%. 
          // If Retail, rate is 0.
          newPphRate = prevState.isTreasurer ? 1.5 : 0;
        }
      }
      return { ...prevState, pphRate: newPphRate };
    });
  }, [state.transactionType, state.hasNpwp, state.isTreasurer, state.customPphRate]);

  // Calculate whenever relevant state changes
  useEffect(() => {
    const taxResult = calculateTax(state.grossAmount, state.ppnRate, state.pphRate);
    setResult(taxResult);
  }, [state.grossAmount, state.ppnRate, state.pphRate]);

  const handleStateChange = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#e55541] p-2 rounded-lg shadow-sm">
              <CalcIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">TaxCalc ID</h1>
              <p className="text-xs text-slate-500 font-medium">Kalkulator Pajak Kasir</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-semibold text-[#0f4372] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#e55541]" />
                  Input Transaksi
                </h2>
              </div>
              <div className="p-6">
                <Calculator 
                  state={state} 
                  onChange={handleStateChange} 
                />
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            {result && (
              <Results 
                result={result} 
                transactionType={state.transactionType}
                pphRate={state.pphRate}
                ppnRate={state.ppnRate}
                isTreasurer={state.isTreasurer}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TaxCalc ID. Internal Use Only.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
