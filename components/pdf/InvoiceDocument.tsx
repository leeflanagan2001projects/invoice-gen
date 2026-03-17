import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import type { Invoice } from '@/types/invoice.types';
import type { BusinessProfile } from '@/types/profile.types';
import { formatPence } from '@/lib/formatters/currency';
import { formatDate } from '@/lib/formatters/date';

const COLORS = {
  primary: '#1B4F8A',
  accent: '#E87722',
  textBase: '#1C2329',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.textBase,
    padding: 40,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  invoiceTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 4,
  },
  businessName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textBase,
  },
  addressLine: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  infoBlock: {
    flex: 1,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: COLORS.white,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tableRowAlt: {
    backgroundColor: COLORS.lightGray,
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colUnit: { flex: 1.5, textAlign: 'right' },
  colSubtotal: { flex: 1.5, textAlign: 'right' },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  totalsLabel: { width: 100, textAlign: 'right', color: COLORS.gray },
  totalsValue: { width: 80, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.primary,
  },
  totalLabel: { width: 100, textAlign: 'right', fontFamily: 'Helvetica-Bold', color: COLORS.primary, fontSize: 12 },
  totalValue: { width: 80, textAlign: 'right', fontFamily: 'Helvetica-Bold', color: COLORS.primary, fontSize: 12 },
  drcNote: {
    backgroundColor: '#FEF9C3',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  drcNoteText: {
    fontSize: 9,
    color: '#92400E',
    fontFamily: 'Helvetica-Bold',
  },
  bankDetails: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  bankTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: COLORS.primary,
    marginBottom: 6,
  },
  bankRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bankLabel: { width: 90, color: COLORS.gray, fontSize: 9 },
  bankValue: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 8,
  },
});

interface InvoiceDocumentProps {
  invoice: Invoice;
  profile: BusinessProfile;
}

export function InvoiceDocument({ invoice, profile }: InvoiceDocumentProps) {
  const { customer, lineItems, vatEnabled, drcMode, vatAmount, subtotal, total } = invoice;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {profile.logoDataUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={profile.logoDataUrl} style={styles.logo} />
            )}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* Business & Customer Info */}
        <View style={styles.infoGrid}>
          {/* From */}
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.businessName}>{profile.businessName}</Text>
            <Text style={styles.addressLine}>{profile.ownerName}</Text>
            <Text style={styles.addressLine}>{profile.address.line1}</Text>
            {profile.address.line2 && <Text style={styles.addressLine}>{profile.address.line2}</Text>}
            <Text style={styles.addressLine}>{profile.address.city}{profile.address.county ? `, ${profile.address.county}` : ''}</Text>
            <Text style={styles.addressLine}>{profile.address.postcode}</Text>
            <Text style={styles.addressLine}>{profile.email}</Text>
            <Text style={styles.addressLine}>{profile.phone}</Text>
            {profile.vatRegistered && profile.vatNumber && (
              <Text style={[styles.addressLine, { marginTop: 6, fontFamily: 'Helvetica-Bold' }]}>
                VAT No: {profile.vatNumber}
              </Text>
            )}
          </View>

          {/* To */}
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>To</Text>
            <Text style={styles.businessName}>{customer.name}</Text>
            {customer.company && <Text style={styles.addressLine}>{customer.company}</Text>}
            <Text style={styles.addressLine}>{customer.address.line1}</Text>
            {customer.address.line2 && <Text style={styles.addressLine}>{customer.address.line2}</Text>}
            <Text style={styles.addressLine}>{customer.address.city}{customer.address.county ? `, ${customer.address.county}` : ''}</Text>
            <Text style={styles.addressLine}>{customer.address.postcode}</Text>
            <Text style={styles.addressLine}>{customer.email}</Text>
          </View>

          {/* Dates */}
          <View style={[styles.infoBlock, { alignItems: 'flex-end' }]}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={[styles.addressLine, { textAlign: 'right' }]}>Issue Date:</Text>
            <Text style={[styles.businessName, { textAlign: 'right', fontSize: 10 }]}>{formatDate(invoice.issueDate)}</Text>
            <Text style={[styles.addressLine, { marginTop: 8, textAlign: 'right' }]}>Due Date:</Text>
            <Text style={[styles.businessName, { textAlign: 'right', fontSize: 10 }]}>{formatDate(invoice.dueDate)}</Text>
            {invoice.jobAddress && (
              <>
                <Text style={[styles.addressLine, { marginTop: 8, textAlign: 'right' }]}>Job Address:</Text>
                <Text style={[styles.addressLine, { textAlign: 'right' }]}>{invoice.jobAddress.line1}</Text>
                <Text style={[styles.addressLine, { textAlign: 'right' }]}>{invoice.jobAddress.city} {invoice.jobAddress.postcode}</Text>
              </>
            )}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.section}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.colUnit]}>Unit Price</Text>
              <Text style={[styles.tableHeaderText, styles.colSubtotal]}>Amount</Text>
            </View>

            {/* Rows */}
            {lineItems.map((item, idx) => (
              <View key={item.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colUnit}>{formatPence(item.unitPrice)}</Text>
                <Text style={styles.colSubtotal}>{formatPence(item.subtotal)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>{formatPence(subtotal)}</Text>
          </View>

          {vatEnabled && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>{drcMode ? 'VAT (RC)' : 'VAT (20%)'}</Text>
              <Text style={styles.totalsValue}>{drcMode ? '£0.00' : formatPence(vatAmount)}</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{formatPence(total)}</Text>
          </View>

          {drcMode && (
            <View style={styles.drcNote}>
              <Text style={styles.drcNoteText}>
                Reverse Charge – Customer to account for VAT to HMRC under Construction Industry Scheme.
              </Text>
            </View>
          )}
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={{ fontSize: 9, color: COLORS.gray, lineHeight: 1.5 }}>{invoice.notes}</Text>
          </View>
        )}

        {/* Bank Details */}
        <View style={styles.bankDetails}>
          <Text style={styles.bankTitle}>Payment Details – Bank Transfer</Text>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Account Name:</Text>
            <Text style={styles.bankValue}>{profile.businessName}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Account Number:</Text>
            <Text style={styles.bankValue}>{profile.bankAccountNumber}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Sort Code:</Text>
            <Text style={styles.bankValue}>{profile.sortCode}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Reference:</Text>
            <Text style={styles.bankValue}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {profile.businessName} · {profile.email} · {profile.phone}
          {profile.vatRegistered ? ` · VAT: ${profile.vatNumber}` : ''}
        </Text>
      </Page>
    </Document>
  );
}
