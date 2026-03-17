/** Generate invoice number: INV-YYYY-XXXX where XXXX is zero-padded sequence */
export function generateInvoiceNumber(year: number, sequence: number): string {
  const seq = String(sequence).padStart(4, '0');
  return `INV-${year}-${seq}`;
}
