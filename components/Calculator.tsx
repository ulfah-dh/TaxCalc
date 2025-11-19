
import React from 'react';
import { CalculatorState, TransactionType } from '../types';
import { User, Building2, ShoppingBag, Wrench, Info } from 'lucide-react';

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
        <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Transaksi</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onChange({ transactionType: TransactionType.GOODS, customPphRate: null })}
            className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
              state.transactionType === TransactionType.GOODS
                ? 'bg-[#e55541] border-[#e55541] text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-[#e55541]/30'
            }`}
          >
            <ShoppingBag className={`w-6 h-6 mb-2 ${state.transactionType === TransactionType.GOODS ? 'text-white' : 'text-[#e55541]'}`} />
            <span className="font-medium">Barang (Goods)</span>
            <span className={`text-xs mt-1 ${state.transactionType === TransactionType.GOODS ? 'text-white/80' : 'text-slate-400'}`}>
              PPh 22 / Retail
            </span>
          </button>

          <button
            onClick={() => onChange({ transactionType: TransactionType.SERVICES, customPphRate: null })}
            className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
              state.transactionType === TransactionType.SERVICES
                ? 'bg-[#e55541] border-[#e55541] text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-[#e55541]/30'
            }`}
          >
            <Wrench className={`w-6 h-6 mb-2 ${state.transactionType === TransactionType.SERVICES ? 'text-white' : 'text-[#e55541]'}`} />
            <span className="font-medium">Jasa (Services)</span>
            <span className={`text-xs mt-1 ${state.transactionType === TransactionType.SERVICES ? 'text-white/80' : 'text-slate-400'}`}>
              PPh 23
            </span>
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Total Sales / Nilai Invoice (Inc. PPN)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400 font-semibold">Rp</span>
          </div>
          <input
            type="text"
            value={state.grossAmount === 0 ? '' : state.grossAmount.toLocaleString('id-ID')}
            onChange={handleAmountChange}
            className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#e55541] focus:border-[#e55541] text-lg font-semibold text-slate-900 placeholder-slate-300 transition-shadow"
            placeholder="0"
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
          <Info className="w-3 h-3 text-[#648aa3]" /> Masukkan angka final di Invoice (Grand Total).
        </p>
      </div>

      {/* WAPU / Treasurer Option */}
      <div className="bg-[#f6b742]/10 p-4 rounded-lg border border-[#f6b742]/30">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="flex items-center h-5 mt-0.5">
            <input
              type="checkbox"
              checked={state.isTreasurer}
              onChange={(e) => onChange({ isTreasurer: e.target.checked })}
              className="w-4 h-4 text-[#e55541] border-gray-300 rounded focus:ring-[#e55541]"
            />
          </div>
          <div>
            <span className="text-sm font-medium text-slate-800">
              Bendaharawan Pemerintah / BUMN (WAPU)
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              Aktifkan jika Customer setor pajak sendiri. {isGoods ? '(PPh 22 tarif 1.5%)' : '(PPh 23 tarif tetap, hanya metode bayar)'}
            </p>
          </div>
        </label>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NPWP Toggle */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <label className="flex items-center justify-between cursor-pointer mb-2">
            <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-[#648aa3]" /> Status NPWP Vendor
            </span>
            <div className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={state.hasNpwp}
                onChange={(e) => onChange({ hasNpwp: e.target.checked })}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#e55541]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f4372]"></div>
            </div>
          </label>
          <p className="text-xs text-slate-500">
            {state.hasNpwp ? 'Ada NPWP (Tarif Normal)' : 'Non-NPWP (Tarif 2x Lipat)'}
          </p>
        </div>

        {/* PPN Rate */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
           <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
             <Building2 className="w-4 h-4 text-[#648aa3]" /> Tarif PPN (%)
           </label>
           <input
            type="number"
            value={state.ppnRate}
            onChange={(e) => onChange({ ppnRate: Number(e.target.value) })}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-[#e55541] focus:border-[#e55541]"
           />
        </div>
      </div>

      {/* Advanced PPh Override */}
      <div>
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm text-[#648aa3] hover:text-[#0f4372] transition-colors">
            <span>Manual Override Tarif Pajak</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <div className="text-slate-600 mt-3 bg-slate-50 p-4 rounded-lg border border-slate-100 animate-in slide-in-from-top-2 duration-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Manual PPh Rate (%)
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
                className="block w-32 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-[#e55541] focus:border-[#e55541]"
              />
              <span className="text-xs text-slate-500">
                Gunakan ini jika tarif otomatis ({state.pphRate}%) tidak sesuai.
              </span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
