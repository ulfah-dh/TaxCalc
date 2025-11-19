import { TaxResult } from '../types';

/**
 * Calculates Indonesian tax components based on a Gross Amount (Inclusive of PPN).
 * 
 * Formula:
 * DPP = Gross / (1 + (PPN Rate / 100))
 * PPN = DPP * (PPN Rate / 100)
 * PPh = DPP * (PPh Rate / 100)
 * 
 * @param grossAmount Total amount including PPN
 * @param ppnRate Percentage of PPN (e.g., 11)
 * @param pphRate Percentage of PPh (e.g., 2)
 */
export const calculateTax = (
  grossAmount: number, 
  ppnRate: number, 
  pphRate: number
): TaxResult => {
  // Avoid division by zero
  if (grossAmount <= 0) {
    return {
      dpp: 0,
      ppnAmount: 0,
      pphAmount: 0,
      totalInvoice: 0,
      cashReceivedNormal: 0,
      cashReceivedNetPPh: 0,
      cashReceivedWapu: 0
    };
  }

  // 1. Calculate DPP (Dasar Pengenaan Pajak)
  // Gross = DPP + PPN
  // Gross = DPP + (DPP * Rate)
  // Gross = DPP * (1 + Rate)
  // DPP = Gross / (1 + Rate)
  const ppnDecimal = ppnRate / 100;
  const dpp = Math.round(grossAmount / (1 + ppnDecimal));

  // 2. Calculate PPN Amount
  const ppnAmount = Math.round(dpp * ppnDecimal);

  // 3. Calculate PPh (Income Tax - usually withheld by buyer)
  const pphDecimal = pphRate / 100;
  const pphAmount = Math.round(dpp * pphDecimal);

  // 4. Calculate Cash Flow Scenarios

  // A. Normal Retail: Seller receives everything (DPP + PPN)
  // Informa pays PPN to Gov later.
  const cashReceivedNormal = dpp + ppnAmount;

  // B. Standard B2B (Withholding PPh): Seller receives (Invoice - PPh)
  // Customer pays PPh to Gov, gives Bukti Potong to Informa.
  const cashReceivedNetPPh = (dpp + ppnAmount) - pphAmount;

  // C. WAPU (Wajib Pungut / Treasurer): Seller receives (DPP - PPh)
  // Customer pays PPN AND PPh directly to Gov. Informa receives net of taxes.
  const cashReceivedWapu = dpp - pphAmount;

  return {
    dpp,
    ppnAmount,
    pphAmount,
    totalInvoice: grossAmount,
    cashReceivedNormal,
    cashReceivedNetPPh,
    cashReceivedWapu
  };
};

export const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};