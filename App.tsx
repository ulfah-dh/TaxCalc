
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
    <div className="min-h-screen bg-[#0f4372] text-white flex flex-col font-sans selection:bg-[#e55541] selection:text-white">
      {/* Header - Now blends with blue background but has a subtle separator */}
      <header className="sticky top-0 z-30 bg-[#0f4372] border-b border-white/10 shadow-lg shadow-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl shadow-md">
              <CalcIcon className="w-6 h-6 text-[#e55541]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">Informa Cashier Tax Calculator</h1>
              <p className="text-xs text-blue-200 font-medium mt-1">Informa Cashier Helper - Pajak jelas, transaksi beres.</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-blue-100 border border-white/10">
              v1.3 Live
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-[#0f4372] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#e55541]" />
                  Input Transaksi
                </h2>
              </div>
              <div className="p-6 text-slate-900">
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

      <footer className="border-t border-white/10 py-8 mt-auto bg-[#0a2e4f]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/80 text-sm font-medium">&copy; {new Date().getFullYear()} Ulfah D Hikmah - OMT HCI 17. Internal Use Only.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
