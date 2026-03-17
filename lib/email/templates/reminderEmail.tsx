import {
  Html, Head, Body, Container, Section, Text, Hr, Row, Column
} from '@react-email/components';
import { formatPence } from '@/lib/formatters/currency';
import { formatDate } from '@/lib/formatters/date';
import type { Invoice } from '@/types/invoice.types';
import type { BusinessProfile } from '@/types/profile.types';

interface ReminderEmailProps {
  invoice: Invoice;
  profile: BusinessProfile;
  reminderNumber: number;
}

export function ReminderEmail({ invoice, profile, reminderNumber }: ReminderEmailProps) {
  const isFirst = reminderNumber === 1;
  const isUrgent = reminderNumber >= 3;

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F5F7FA', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 0' }}>
          <Section style={{ backgroundColor: isUrgent ? '#B91C1C' : '#1B4F8A', padding: '24px', borderRadius: '12px 12px 0 0' }}>
            <Text style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
              {isUrgent ? 'Urgent: ' : ''}Payment Reminder
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '4px 0 0' }}>
              Invoice {invoice.invoiceNumber} · {profile.businessName}
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '0 0 12px 12px' }}>
            <Text style={{ fontSize: '16px', color: '#1C2329' }}>Dear {invoice.customer.name},</Text>

            <Text style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
              {isFirst
                ? `This is a friendly reminder that payment for invoice ${invoice.invoiceNumber} is now due.`
                : `We notice that invoice ${invoice.invoiceNumber} remains unpaid. ${isUrgent ? 'Please arrange payment immediately to avoid further action.' : 'We would appreciate prompt payment.'}`
              }
            </Text>

            <Section style={{ backgroundColor: isUrgent ? '#FEF2F2' : '#F5F7FA', borderRadius: '8px', padding: '16px', margin: '16px 0', borderLeft: isUrgent ? '4px solid #B91C1C' : 'none' }}>
              <Row>
                <Column><Text style={{ color: '#6B7280', fontSize: '12px', margin: '0' }}>Invoice</Text></Column>
                <Column style={{ textAlign: 'right' }}><Text style={{ fontWeight: 'bold', margin: '0' }}>{invoice.invoiceNumber}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={{ color: '#6B7280', fontSize: '12px', margin: '8px 0 0' }}>Due Date</Text></Column>
                <Column style={{ textAlign: 'right' }}><Text style={{ color: '#B91C1C', fontWeight: 'bold', margin: '8px 0 0' }}>{formatDate(invoice.dueDate)}</Text></Column>
              </Row>
              <Hr style={{ borderColor: '#E5E7EB', margin: '12px 0' }} />
              <Row>
                <Column><Text style={{ fontWeight: 'bold', fontSize: '16px', margin: '0' }}>Amount Owed</Text></Column>
                <Column style={{ textAlign: 'right' }}><Text style={{ fontWeight: 'bold', fontSize: '20px', color: '#B91C1C', margin: '0' }}>{formatPence(invoice.total)}</Text></Column>
              </Row>
            </Section>

            <Text style={{ fontWeight: 'bold', fontSize: '14px', color: '#1C2329' }}>
              To pay, please use bank transfer:
            </Text>
            <Text style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8' }}>
              Account Name: <strong>{profile.businessName}</strong><br />
              Account Number: <strong>{profile.bankAccountNumber}</strong><br />
              Sort Code: <strong>{profile.sortCode}</strong><br />
              Reference: <strong>{invoice.invoiceNumber}</strong>
            </Text>

            <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '16px' }}>
              If you have already made payment, please disregard this notice. For queries, contact {profile.email} or {profile.phone}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
