/** Convert pence (integer) to pounds display string e.g. 150000 → "£1,500.00" */
export function formatPence(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(pence / 100);
}

/** Convert pence to pounds number e.g. 150000 → 1500 */
export function penceToPounds(pence: number): number {
  return pence / 100;
}

/** Convert pounds string/number to pence integer e.g. "12.50" → 1250 */
export function poundsToPence(pounds: string | number): number {
  const val = typeof pounds === 'string' ? parseFloat(pounds) : pounds;
  if (isNaN(val)) return 0;
  return Math.round(val * 100);
}

/** Calculate VAT on a net amount in pence */
export function calculateVat(netPence: number, rate: 20): number {
  return Math.round(netPence * rate / 100);
}
