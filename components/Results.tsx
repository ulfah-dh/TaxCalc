
import React, { useMemo } from 'react';
import { TaxResult, TransactionType } from '../types';
import { formatIDR } from '../services/taxUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { COLORS } from '../constants';
import { Copy, FileText, Building2, User, Landmark } from 'lucide-react';

interface ResultsProps {
  result: TaxResult;
  transactionType: TransactionType;
  pphRate: number;
  ppnRate: number;
  isTreasurer: boolean;
}

export const Results: React.FC<ResultsProps> = ({ result, transactionType, pphRate, ppnRate, isTreasurer }) => {
  
  const chartData = useMemo(() => [
    { name: 'DPP (Harga Barang/Jasa)', value: result.dpp },
    { name: `PPN (${ppnRate}%)`, value: result.ppnAmount },
  ], [result, ppnRate]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Rincian disalin ke clipboard!");
  };

  const pphLabel = transactionType === TransactionType.SERVICES ? 'PPh 23 (Jasa)' : 'PPh 22 (Barang)';
  const isWithheld = pphRate > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      
      {/* Summary Header: Total Invoice (The Contract Value) */}
      <div className="bg-[#0f4372] p-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[#83baa3] text-sm font-medium flex items-center gap-2 uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Total Nilai Invoice
          </p>
          <span className="bg-[#e55541] text-xs font-bold px-2 py-1 rounded text-white">Inc. PPN</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-1 text-white">{formatIDR(result.totalInvoice)}</h2>
        <p className="text-slate-300 text-sm">Nilai kontrak final yang tertera di kuitansi/faktur.</p>
      </div>

      {/* Scenario Cards: Cash Received */}
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <h3 className="text-sm font-bold text-[#0f4372] uppercase tracking-wide mb-4">Simulasi Uang Diterima (Cash In)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Scenario 1: Normal Retail */}
          <div className={`p-4 rounded-lg border ${!isWithheld && !isTreasurer ? 'bg-white border-[#e55541] ring-1 ring-[#e55541]' : 'bg-white border-slate-200 opacity-70'}`}>
            <div className="flex items-center gap-2 mb-2">
              <User className={`w-4 h-4 ${!isWithheld && !isTreasurer ? 'text-[#e55541]' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-700 uppercase">Customer Umum</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{formatIDR(result.cashReceivedNormal)}</p>
            <p className="text-xs text-slate-500 mt-1">Customer bayar Full sesuai Invoice.</p>
          </div>

          {/* Scenario 2: Standard B2B */}
          <div className={`p-4 rounded-lg border ${isWithheld && !isTreasurer ? 'bg-white border-[#e55541] ring-1 ring-[#e55541]' : 'bg-white border-slate-200 opacity-70'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className={`w-4 h-4 ${isWithheld && !isTreasurer ? 'text-[#e55541]' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-700 uppercase">Potong PPh</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{formatIDR(result.cashReceivedNetPPh)}</p>
            <p className="text-xs text-slate-500 mt-1">Invoice dikurangi {pphLabel}.</p>
          </div>

          {/* Scenario 3: WAPU/Treasurer */}
          <div className={`p-4 rounded-lg border ${isTreasurer ? 'bg-white border-[#e55541] ring-1 ring-[#e55541]' : 'bg-white border-slate-200 opacity-70'}`}>
             <div className="flex items-center gap-2 mb-2">
              <Landmark className={`w-4 h-4 ${isTreasurer ? 'text-[#e55541]' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-700 uppercase">WAPU / Bendahara</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{formatIDR(result.cashReceivedWapu)}</p>
            <p className="text-xs text-slate-500 mt-1">Invoice dikurangi PPh & PPN.</p>
          </div>

        </div>
      </div>

      {/* Detailed Breakdown Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-4">
          <h3 className="text-[#0f4372] font-bold text-lg mb-4 border-b pb-2">Rincian Komponen</h3>
          
          {/* Row 1: DPP */}
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div>
              <span className="block text-[#0f4372] font-medium">DPP</span>
              <span className="text-xs text-slate-500">Harga Sebelum Pajak</span>
            </div>
            <span className="font-mono font-semibold text-slate-900">{formatIDR(result.dpp)}</span>
          </div>

          {/* Row 2: PPN */}
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div>
              <span className="block text-[#0f4372] font-medium">PPN ({ppnRate}%)</span>
              <span className="text-xs text-slate-500">Value Added Tax</span>
            </div>
            <span className="font-mono font-semibold text-[#e55541]">{formatIDR(result.ppnAmount)}</span>
          </div>

          {/* Row 3: PPh */}
          {isWithheld ? (
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
              <div>
                <span className="block text-[#e55541] font-medium">{pphLabel} ({pphRate}%)</span>
                <span className="text-xs text-red-400">Nilai Potongan Pajak Penghasilan</span>
              </div>
              <span className="font-mono font-semibold text-[#e55541]">{formatIDR(result.pphAmount)}</span>
            </div>
          ) : (
            <div className="flex justify-between items-center p-3 bg-slate-50 border border-dashed border-slate-200 opacity-60">
               <div>
                <span className="block text-slate-600 font-medium">{pphLabel} (0%)</span>
                <span className="text-xs text-slate-400">Tidak ada pemotongan</span>
              </div>
              <span className="font-mono font-semibold text-slate-400">-</span>
            </div>
          )}

           <div className="mt-4 pt-4 border-t border-dashed border-slate-300">
             <button 
               onClick={() => {
                 const text = `Rincian Invoice (Inc PPN):\nTotal Invoice: ${formatIDR(result.totalInvoice)}\n\nKomponen:\nDPP: ${formatIDR(result.dpp)}\nPPN (${ppnRate}%): ${formatIDR(result.ppnAmount)}\n${pphLabel} (${pphRate}%): ${formatIDR(result.pphAmount)}\n\nOpsi Pembayaran:\n- Full (Retail): ${formatIDR(result.cashReceivedNormal)}\n- Potong PPh (B2B): ${formatIDR(result.cashReceivedNetPPh)}\n- Potong PPh+PPN (WAPU): ${formatIDR(result.cashReceivedWapu)}`;
                 copyToClipboard(text);
               }}
               className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 hover:text-[#e55541] hover:border-[#e55541] transition-all"
             >
               <Copy className="w-4 h-4" />
               Salin Semua Rincian
             </button>
           </div>
        </div>

        {/* Chart Section */}
        <div className="flex flex-col items-center justify-center min-h-[250px] bg-slate-50 rounded-xl border border-slate-200 relative">
          <h4 className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Komposisi Invoice</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="dpp" fill={COLORS.soft} />
                <Cell key="ppn" fill={COLORS.primary} />
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatIDR(value)}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-6">
            <span className="text-xs text-slate-500 font-medium">Total</span>
            <p className="text-sm font-bold text-[#0f4372]">{formatIDR(result.totalInvoice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
