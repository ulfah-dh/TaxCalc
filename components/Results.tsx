
import React, { useMemo } from 'react';
import { TaxResult, TransactionType } from '../types';
import { formatIDR } from '../services/taxUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { COLORS } from '../constants';
import { Copy, FileText, Building2, User, Landmark, Scale, BookOpen, AlertCircle, Wallet, ArrowRight } from 'lucide-react';

interface ResultsProps {
  result: TaxResult;
  transactionType: TransactionType;
  pphRate: number;
  ppnRate: number;
  isTreasurer: boolean;
}

export const Results: React.FC<ResultsProps> = ({ result, transactionType, pphRate, ppnRate, isTreasurer }) => {
  
  const chartData = useMemo(() => [
    { name: 'DPP (Net Sales)', value: result.dpp },
    { name: `PPN (${ppnRate}%)`, value: result.ppnAmount },
  ], [result, ppnRate]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Rincian disalin ke clipboard!");
  };

  const pphLabel = transactionType === TransactionType.SERVICES ? 'PPh 23 (Jasa)' : 'PPh 22 (Barang)';
  const isWithheld = pphRate > 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        
        {/* Summary Header: Total Invoice - Red Gradient */}
        <div className="bg-gradient-to-br from-[#e55541] to-[#c54130] p-8 text-white relative overflow-hidden shadow-inner">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <p className="text-red-100 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" /> Total Nilai Invoice
              </p>
              <span className="bg-white/20 border border-white/30 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm">
                Include PPN {ppnRate}%
              </span>
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-2 text-white drop-shadow-md">{formatIDR(result.totalInvoice)}</h2>
            <p className="text-red-100 text-sm font-medium opacity-90">Total yang ditagihkan ke customer pada kuitansi/invoice</p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-6 -top-24 w-72 h-72 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute -left-10 -bottom-20 w-56 h-56 bg-black/10 rounded-full blur-2xl mix-blend-multiply"></div>
        </div>

        {/* Scenario Cards: Cash Received - Now Color Coded */}
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Estimasi Cash Flow (Uang Masuk)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Scenario 1: Retail (Green / Success) */}
            <div className={`relative p-5 rounded-xl border-2 transition-all overflow-hidden group ${!isWithheld && !isTreasurer ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-100' : 'bg-white border-slate-100 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
              {(!isWithheld && !isTreasurer) && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>}
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${!isWithheld && !isTreasurer ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                  <User className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold uppercase ${!isWithheld && !isTreasurer ? 'text-emerald-800' : 'text-slate-500'}`}>Retail / Personal</span>
              </div>
              <p className={`text-lg font-bold ${!isWithheld && !isTreasurer ? 'text-emerald-900' : 'text-slate-800'}`}>{formatIDR(result.cashReceivedNormal)}</p>
              <p className={`text-[10px] mt-1 font-medium flex items-center gap-1 ${!isWithheld && !isTreasurer ? 'text-emerald-600' : 'text-slate-400'}`}>
                <ArrowRight className="w-3 h-3" /> Terima Full 100%
              </p>
            </div>

            {/* Scenario 2: B2B (Steel Blue / Corporate) */}
            <div className={`relative p-5 rounded-xl border-2 transition-all overflow-hidden group ${isWithheld && !isTreasurer ? 'bg-[#648aa3]/10 border-[#648aa3] shadow-lg shadow-blue-100' : 'bg-white border-slate-100 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
              {(isWithheld && !isTreasurer) && <div className="absolute top-0 right-0 bg-[#648aa3] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">SELECTED</div>}
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${isWithheld && !isTreasurer ? 'bg-blue-100 text-[#648aa3]' : 'bg-slate-100 text-slate-400'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold uppercase ${isWithheld && !isTreasurer ? 'text-[#47657b]' : 'text-slate-500'}`}>Swasta/Corporate B2B</span>
              </div>
              <p className={`text-lg font-bold ${isWithheld && !isTreasurer ? 'text-[#0f4372]' : 'text-slate-800'}`}>{formatIDR(result.cashReceivedNetPPh)}</p>
              <p className={`text-[10px] mt-1 font-medium flex items-center gap-1 ${isWithheld && !isTreasurer ? 'text-[#648aa3]' : 'text-slate-400'}`}>
                <ArrowRight className="w-3 h-3" /> Potong {pphLabel}
              </p>
            </div>

            {/* Scenario 3: WAPU (Yellow/Orange / Warning) */}
            <div className={`relative p-5 rounded-xl border-2 transition-all overflow-hidden group ${isTreasurer ? 'bg-[#f6b742]/10 border-[#f6b742] shadow-lg shadow-orange-100' : 'bg-white border-slate-100 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
               {(isTreasurer) && <div className="absolute top-0 right-0 bg-[#f6b742] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">SELECTED</div>}
               <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${isTreasurer ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Landmark className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold uppercase ${isTreasurer ? 'text-orange-700' : 'text-slate-500'}`}>WAPU / BUMN</span>
              </div>
              <p className={`text-lg font-bold ${isTreasurer ? 'text-orange-900' : 'text-slate-800'}`}>{formatIDR(result.cashReceivedWapu)}</p>
              <p className={`text-[10px] mt-1 font-medium flex items-center gap-1 ${isTreasurer ? 'text-orange-600' : 'text-slate-400'}`}>
                <ArrowRight className="w-3 h-3" /> Potong PPh & PPN
              </p>
            </div>

          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-5">
            <h3 className="text-[#0f4372] font-bold text-lg mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#e55541] rounded-full"></div>
              Rincian Komponen
            </h3>
            
            {/* Row 1: DPP */}
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="block text-[#0f4372] font-bold text-sm">DPP</span>
                <span className="text-xs text-slate-400">Dasar Pengenaan Pajak</span>
              </div>
              <span className="font-mono font-bold text-lg text-slate-800">{formatIDR(result.dpp)}</span>
            </div>

            {/* Row 2: PPN */}
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="block text-[#0f4372] font-bold text-sm">PPN ({ppnRate}%)</span>
                <span className="text-xs text-slate-400">Pajak Pertambahan Nilai</span>
              </div>
              <span className="font-mono font-bold text-lg text-[#e55541]">{formatIDR(result.ppnAmount)}</span>
            </div>

            {/* Row 3: PPh */}
            {isWithheld ? (
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <span className="block text-[#b91c1c] font-bold text-sm">{pphLabel} ({pphRate}%)</span>
                  <span className="text-xs text-red-400">Potongan Pajak (Withholding)</span>
                </div>
                <span className="font-mono font-bold text-lg text-[#b91c1c]">({formatIDR(result.pphAmount)})</span>
              </div>
            ) : (
              <div className="flex justify-between items-center p-4 bg-white border-2 border-dashed border-slate-200 rounded-xl opacity-60">
                 <div>
                  <span className="block text-slate-400 font-bold text-sm">{pphLabel} (0%)</span>
                  <span className="text-xs text-slate-300">Tidak ada potongan</span>
                </div>
                <span className="font-mono font-bold text-lg text-slate-300">-</span>
              </div>
            )}

             <div className="mt-6 pt-6 border-t border-slate-100">
               <button 
                 onClick={() => {
                   const text = `*Kalkulasi Pajak Informa*\n\nTotal Invoice: ${formatIDR(result.totalInvoice)}\n\nRincian:\n- DPP: ${formatIDR(result.dpp)}\n- PPN (${ppnRate}%): ${formatIDR(result.ppnAmount)}\n- ${pphLabel} (${pphRate}%): ${formatIDR(result.pphAmount)}\n\nCash Flow:\n- Retail: ${formatIDR(result.cashReceivedNormal)}\n- B2B: ${formatIDR(result.cashReceivedNetPPh)}\n- WAPU: ${formatIDR(result.cashReceivedWapu)}`;
                   copyToClipboard(text);
                 }}
                 className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-slate-300 shadow-sm text-sm font-bold rounded-lg text-slate-600 bg-white hover:bg-slate-50 hover:text-[#e55541] hover:border-[#e55541] transition-all"
               >
                 <Copy className="w-4 h-4" />
                 Copy Rincian Transaksi
               </button>
             </div>
          </div>

          {/* Chart Section */}
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-50 rounded-2xl border border-slate-100 relative p-4">
            <h4 className="absolute top-5 left-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Proporsi Invoice</h4>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="dpp" fill={COLORS.secondary} /> {/* Blue */}
                  <Cell key="ppn" fill={COLORS.primary} />   {/* Red */}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatIDR(value)}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</span>
              <p className="text-sm font-bold text-[#0f4372]">{formatIDR(result.totalInvoice)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Basis Section (Dynamic) */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-4">
          <Scale className="w-4 h-4 text-[#f6b742]" />
          Dasar Hukum & Referensi
        </h3>
        <ul className="space-y-3 text-xs text-blue-100/80">
          <li className="flex gap-3 items-start">
            <BookOpen className="w-4 h-4 mt-0.5 text-blue-300 shrink-0" />
            <span>
              <strong className="text-white">PPN {ppnRate}%:</strong> {ppnRate === 11 ? 'Mengacu pada UU No. 7 Tahun 2021 (UU HPP) Tarif Berlaku.' : 'Sesuai UU HPP, kenaikan tarif menjadi 12% dijadwalkan paling lambat 1 Januari 2025.'}
            </span>
          </li>
          
          {transactionType === TransactionType.SERVICES && (
            <li className="flex gap-3 items-start">
              <BookOpen className="w-4 h-4 mt-0.5 text-blue-300 shrink-0" />
              <span>
                <strong className="text-white">PPh 23 ({pphRate}%):</strong> UU PPh No. 36 Tahun 2008 Pasal 23 (Jasa Teknik, Manajemen, dll). Tarif normal 2% (NPWP) atau 4% (Non-NPWP).
              </span>
            </li>
          )}

          {transactionType === TransactionType.GOODS && isTreasurer && (
             <li className="flex gap-3 items-start">
              <BookOpen className="w-4 h-4 mt-0.5 text-blue-300 shrink-0" />
              <span>
                <strong className="text-white">PPh 22 ({pphRate}%):</strong> PMK 34/PMK.010/2017 tentang Pemungutan PPh Pasal 22 sehubungan dengan pembayaran atas penyerahan barang kepada Bendaharawan/BUMN.
              </span>
            </li>
          )}

          {pphRate > 3 && (
            <li className="flex gap-3 items-start bg-red-500/10 p-2 rounded-lg border border-red-500/20">
               <AlertCircle className="w-4 h-4 mt-0.5 text-[#e55541] shrink-0" />
               <span className="text-red-200">
                <strong className="text-white">Denda Non-NPWP:</strong> Tarif dikenakan 100% lebih tinggi (2x lipat) sesuai UU PPh Pasal 23 Ayat 1a.
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
