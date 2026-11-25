const https = require('https');

const RESEND_API_HOST = 'api.resend.com';
const DEFAULT_FROM = 'onboarding@resend.dev';

function postToResend(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);

    const req = https.request(
      {
        hostname: RESEND_API_HOST,
        path: '/emails',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let response = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { response += chunk; });
        res.on('end', () => {
          let data = {};
          try { data = response ? JSON.parse(response) : {}; } catch (_) {}

          if (res.statusCode >= 200 && res.statusCode < 300) {
            return resolve(data);
          }

          const message = data?.message || data?.name || `Resend returned HTTP ${res.statusCode}`;
          reject(new Error(message));
        });
      }
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendLeadEmails({ name, email, phone = '', company = '', message, productName = '' }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL || 'jkwtextile@gmail.com';
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured on the server.');
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || 'Not provided');
  const safeCompany = escapeHtml(company || 'Not provided');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const safeProduct = escapeHtml(productName || 'General enquiry');

  const subject = `New JKW Textiles enquiry from ${name}`;

  await postToResend(
    {
      from,
      to: [to],
      reply_to: email,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;max-width:680px">
          <h2 style="margin-bottom:20px">New JKW Textiles Enquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Company:</strong> ${safeCompany}</p>
          <p><strong>Product:</strong> ${safeProduct}</p>
          <p><strong>Message:</strong></p>
          <div style="padding:14px;background:#f6f6f6;border-radius:8px">${safeMessage}</div>
        </div>
      `,
      text: [
        'New JKW Textiles Enquiry',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Company: ${company || 'Not provided'}`,
        `Product: ${productName || 'General enquiry'}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    },
    apiKey
  );

  // Optional customer acknowledgement. Set SEND_CUSTOMER_CONFIRMATION=false to disable.
  if (process.env.SEND_CUSTOMER_CONFIRMATION !== 'false') {
    try {
      await postToResend(
        {
          from,
          to: [email],
          reply_to: to,
          subject: 'We received your enquiry — JKW Textiles',
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;max-width:680px">
              <h2>Thank you for contacting JKW Textiles</h2>
              <p>Hi ${safeName},</p>
              <p>We have received your enquiry and our team will get back to you shortly.</p>
              <p><strong>Your message:</strong></p>
              <div style="padding:14px;background:#f6f6f6;border-radius:8px">${safeMessage}</div>
              <p style="margin-top:24px">JKW Textiles<br />${escapeHtml(to)}</p>
            </div>
          `,
          text: `Hi ${name},\n\nWe have received your enquiry and our team will get back to you shortly.\n\nYour message:\n${message}\n\nJKW Textiles`,
        },
        apiKey
      );
    } catch (confirmationError) {
      // The business notification has already succeeded, so don't fail the enquiry
      // only because the optional customer acknowledgement could not be delivered.
      console.error('Customer confirmation email failed:', confirmationError.message);
    }
  }
}

module.exports = { sendLeadEmails };
