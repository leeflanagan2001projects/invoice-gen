import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

function normaliseMobile(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return `+44${digits.slice(1)}`;
  if (digits.startsWith('44')) return `+${digits}`;
  return `+${digits}`;
}

export async function POST(req: NextRequest) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  try {
    const { to, body } = await req.json();
    if (!to || !body) {
      return NextResponse.json({ error: 'Missing to or body' }, { status: 400 });
    }

    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: normaliseMobile(to),
      body,
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (err) {
    console.error('send-sms error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
