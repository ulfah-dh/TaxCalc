export enum TransactionType {
  GOODS = 'GOODS',
  SERVICES = 'SERVICES'
}

export interface CalculatorState {
  grossAmount: number; // Harga Include PPN
  hasNpwp: boolean;
  isTreasurer: boolean; // Flag for PPh 22 (Bendaharawan/BUMN)
  transactionType: TransactionType;
  ppnRate: number; // Percentage (e.g., 11)
  pphRate: number; // Percentage (e.g., 2, 1.5, 4)
  customPphRate: number | null;
}

export interface TaxResult {
  dpp: number;
  ppnAmount: number;
  pphAmount: number;
  totalInvoice: number; // Gross Amount (Sales)
  
  // Cash Flow Scenarios
  cashReceivedNormal: number; // Retail (Received DPP + PPN)
  cashReceivedNetPPh: number; // Common B2B (Received Invoice - PPh)
  cashReceivedWapu: number;   // Treasurer/WAPU (Received DPP - PPh, PPN withheld)
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill: string;
}