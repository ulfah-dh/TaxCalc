
import React from 'react';
import { CalculatorState, TransactionType } from '../types';
import { User, Building2, ShoppingBag, Wrench, Info, Percent } from 'lucide-react';

interface CalculatorProps {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ state, onChange }) => {

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric chars except standard input behavior
    const val = e.target.value.replace(/\D/g, '');
    onChange({ grossAmount: Number(val) });
  };

  const isGoods = state.transactionType === TransactionType.GOODS;

  return (
    <div className="space-y-6">
      
      {/* Transaction Type Selector */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3">Jenis Transaksi</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onChange({ transactionType: TransactionType.GOODS, customPphRate: null })}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
              state.transactionType === TransactionType.GOODS
                ? 'bg-[#e55541] border-[#e55541] text-white shadow-lg shadow-red-200'
                : 'bg-white border-slate-100 text-slate-500 hover:border-[#e55541]/30 hover:bg-red-50/30'
            }`}
          >
            <ShoppingBag className={`w-6 h-6 mb-2 ${state.transactionType === TransactionType.GOODS ? 'text-white' : 'text-[#e55541]'}`} />
            <span className="font-bold">Barang (Goods)</span>
            <span className={`text-xs mt-1 ${state.transactionType === TransactionType.GOODS ? 'text-white/90' : 'text-slate-400'}`}>
              PPh 22 / Retail
            </span>
          </button>

          <button
            onClick={() => onChange({ transactionType: TransactionType.SERVICES, customPphRate: null })}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
              state.transactionType === TransactionType.SERVICES
                ? 'bg-[#e55541] border-[#e55541] text-white shadow-lg shadow-red-200'
                : 'bg-white border-slate-100 text-slate-500 hover:border-[#e55541]/30 hover:bg-red-50/30'
            }`}
          >
            <Wrench className={`w-6 h-6 mb-2 ${state.transactionType === TransactionType.SERVICES ? 'text-white' : 'text-[#e55541]'}`} />
            <span className="font-bold">Jasa (Services)</span>
            <span className={`text-xs mt-1 ${state.transactionType === TransactionType.SERVICES ? 'text-white/90' : 'text-slate-400'}`}>
              PPh 23
            </span>
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Total Sales (Inc. PPN)
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400 font-bold group-focus-within:text-[#e55541] transition-colors">Rp</span>
          </div>
          <input
            type="text"
            value={state.grossAmount === 0 ? '' : state.grossAmount.toLocaleString('id-ID')}
            onChange={handleAmountChange}
            className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[#e55541] text-xl font-bold text-slate-900 placeholder-slate-300 transition-all"
            placeholder="0"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#648aa3]" /> Masukkan angka Grand Total di Invoice.
        </p>
      </div>

      {/* PPN Toggle */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
         <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
           <Percent className="w-4 h-4 text-[#648aa3]" /> Tarif PPN (VAT)
         </label>
         <div className="grid grid-cols-2 p-1 bg-white rounded-lg border border-slate-200">
            <button
              onClick={() => onChange({ ppnRate: 11 })}
              className={`py-2 text-sm font-semibold rounded-md transition-all ${
                state.ppnRate === 11 
                ? 'bg-[#0f4372] text-white shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              11%
            </button>
            <button
              onClick={() => onChange({ ppnRate: 12 })}
              className={`py-2 text-sm font-semibold rounded-md transition-all ${
                state.ppnRate === 12 
                ? 'bg-[#0f4372] text-white shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              12%
            </button>
         </div>
      </div>

      {/* WAPU / Treasurer Option */}
      <div className="bg-[#f6b742]/10 p-4 rounded-xl border border-[#f6b742]/30">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="flex items-center h-5 mt-0.5">
            <input
              type="checkbox"
              checked={state.isTreasurer}
              onChange={(e) => onChange({ isTreasurer: e.target.checked })}
              className="w-5 h-5 text-[#e55541] border-gray-300 rounded focus:ring-[#e55541]"
            />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800">
              Bendaharawan / BUMN (WAPU)
            </span>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Customer menyetor pajak sendiri ke Kas Negara. <br/>
              {isGoods ? '(PPh 22 tarif 1.5%)' : '(PPh 23 tarif tetap, hanya metode bayar)'}
            </p>
          </div>
        </label>
      </div>

      {/* Settings Grid */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <label className="flex items-center justify-between cursor-pointer mb-2">
          <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-[#648aa3]" /> Status NPWP Vendor
          </span>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={state.hasNpwp}
              onChange={(e) => onChange({ hasNpwp: e.target.checked })}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
          </div>
        </label>
        <p className="text-xs text-slate-500">
          {state.hasNpwp ? 'Memiliki NPWP (Tarif Normal)' : 'Tidak Ada NPWP (Tarif Pajak 100% Lebih Tinggi)'}
        </p>
      </div>

      {/* Advanced PPh Override */}
      <div>
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm text-[#648aa3] hover:text-[#0f4372] transition-colors py-2">
            <span>Manual Override Tarif Pajak</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <div className="text-slate-600 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in slide-in-from-top-2 duration-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Input Manual Tarif PPh (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                placeholder={String(state.pphRate)}
                value={state.customPphRate ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? null : parseFloat(e.target.value);
                  onChange({ customPphRate: val });
                }}
                className="block w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-[#e55541] focus:border-[#e55541]"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">Override hanya jika ada SKB atau kasus khusus.</p>
          </div>
        </details>
      </div>
    </div>
  );
};
