
export const PPN_RATE_DEFAULT = 11;
export const PPH23_WITH_NPWP = 2;
export const PPH23_NON_NPWP = 4;

export const CURRENCY_FORMATTER = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const COLORS = {
  primary: '#e55541', // Informa Red
  secondary: '#0f4372', // Dark Blue
  accent: '#f6b742', // Yellow/Orange
  soft: '#83baa3', // Sage Green
  muted: '#648aa3', // Steel Blue
  danger: '#ef4444', 
  success: '#10b981',
  slate: '#64748b',
};
