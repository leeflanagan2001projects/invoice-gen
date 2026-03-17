import {
  Html, Head, Body, Container, Section, Text, Hr, Row, Column
} from '@react-email/components';
import { formatPence } from '@/lib/formatters/currency';
import { formatDate } from '@/lib/formatters/date';
import type { Invoice } from '@/types/invoice.types';
import type { BusinessProfile } from '@/types/profile.types';

interface InvoiceEmailProps {
  invoice: Invoice;
  profile: BusinessProfile;
}

export function InvoiceEmail({ invoice, profile }: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F5F7FA', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 0' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#1B4F8A', padding: '24px', borderRadius: '12px 12px 0 0' }}>
            <Text style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
              Invoice {invoice.invoiceNumber}
            </Text>
            <Text style={{ color: '#93C5FD', fontSize: '14px', margin: '4px 0 0' }}>
              from {profile.businessName}
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '0 0 12px 12px' }}>
            <Text style={{ fontSize: '16px', color: '#1C2329' }}>
              Dear {invoice.customer.name},
            </Text>
            <Text style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
              Please find your invoice attached for work completed at {invoice.jobAddress.line1}, {invoice.jobAddress.city}.
            </Text>

            {/* Summary */}
            <Section style={{ backgroundColor: '#F5F7FA', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
              <Row>
                <Column><Text style={{ color: '#6B7280', fontSize: '12px', margin: '0' }}>Invoice Number</Text></Column>
                <Column style={{ textAlign: 'right' }}><Text style={{ fontWeight: 'bold', margin: '0' }}>{invoice.invoiceNumber}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={{ color: '#6B7280', fontSize: '12px', margin: '8px 0 0' }}>Issue Date</Text></Column>
                <Column style={{ textAlign: 'right' }}><Text style={{ margin: '8px 0 0' }}>{formatDate(invoice.issueDate)}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={{ color: '#6B7280', fontSize: '12px', margin: '8px 0 0' }}>Due Date</Text></Column>
                <Column style={{ textAlign: 'right' }}><Text style={{ fontWeight: 'bold', color: '#B91C1C', margin: '8px 0 0' }}>{formatDate(invoice.dueDate)}</Text></Column>
              </Row>
              <Hr style={{ borderColor: '#E5E7EB', margin: '12px 0' }} />
              <Row>
                <Column><Text style={{ fontWeight: 'bold', fontSize: '16px', margin: '0' }}>Total Due</Text></Column>
                <Column style={{ textAlign: 'right' }}><Text style={{ fontWeight: 'bold', fontSize: '20px', color: '#1B4F8A', margin: '0' }}>{formatPence(invoice.total)}</Text></Column>
              </Row>
            </Section>

            {/* Bank details */}
            <Text style={{ fontWeight: 'bold', fontSize: '14px', color: '#1C2329', marginTop: '16px' }}>
              Payment by Bank Transfer:
            </Text>
            <Text style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8' }}>
              Account Name: <strong>{profile.businessName}</strong><br />
              Account Number: <strong>{profile.bankAccountNumber}</strong><br />
              Sort Code: <strong>{profile.sortCode}</strong><br />
              Reference: <strong>{invoice.invoiceNumber}</strong>
            </Text>

            {invoice.notes && (
              <>
                <Hr style={{ borderColor: '#E5E7EB' }} />
                <Text style={{ fontSize: '14px', color: '#6B7280' }}>{invoice.notes}</Text>
              </>
            )}

            <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '24px' }}>
              If you have any questions, please contact {profile.email} or {profile.phone}.
            </Text>
          </Section>

          <Text style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', marginTop: '16px' }}>
            {profile.businessName} · {profile.vatRegistered ? `VAT No: ${profile.vatNumber}` : ''}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
