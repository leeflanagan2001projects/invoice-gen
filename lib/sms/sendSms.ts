import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSms(to: string, body: string): Promise<void> {
  const normalised = normaliseMobile(to);
  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: normalised,
    body,
  });
}

function normaliseMobile(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `+44${digits.slice(1)}`;
  }
  if (digits.startsWith('44')) {
    return `+${digits}`;
  }
  return `+${digits}`;
}
