export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, otpCode } = req.body;

  if (!email || !otpCode) {
    return res.status(400).json({ error: 'Email and OTP code are required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Resend API key is not configured' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EliteClub <onboarding@resend.dev>', // Update to your verified domain for production
        to: [email],
        subject: 'Your EliteClub Verification OTP',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
            <h2>EliteClub Check-In</h2>
            <p>Hi ${name || 'Member'},</p>
            <p>Your OTP for verifying your shareable plan check-in is:</p>
            <h1 style="font-size: 32px; letter-spacing: 4px; color: #d4af37;">${otpCode}</h1>
            <p>Please share this code with the hotel staff. It will expire in 10 minutes.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="color: #666; font-size: 12px;">If you didn't request this, please contact support.</p>
          </div>
        `
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Error sending email' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
