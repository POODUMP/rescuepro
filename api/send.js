// api/send.js
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, service, location, message } = req.body || {};

  // Basic validation
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!process.env.RESEND) {
    console.error('Server configuration error: RESEND is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RescuePoo Contact Form <no-reply@rescuepoo.com>',
        to: ['mareedubhargav1717@gmail.com'],
        reply_to: email || undefined,
        subject: `New Service Request – ${service || 'General Inquiry'}`,
        html: `
          <h2 style="color:#C8102E;">New RescuePoo Service Request</h2>
          <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;">
            <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${name || '(not provided)'}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;">${phone}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${email || '(not provided)'}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Service</td><td style="padding:6px 12px;">${service || '(not specified)'}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Location</td><td style="padding:6px 12px;">${location || '(not provided)'}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Message</td><td style="padding:6px 12px;">${message || '(none)'}</td></tr>
          </table>
          <p style="margin-top:20px;color:#888;font-size:12px;">Sent via rescuepro-chi.vercel.app</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend error:', errorData);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
