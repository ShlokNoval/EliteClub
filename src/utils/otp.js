/**
 * EliteClub - OTP Utility
 * 
 * To implement live SMS via Fast2SMS (Free Tier/Cheap in India):
 * 1. Go to fast2sms.com and get an API key.
 * 2. It is highly recommended to call this API from a secure backend (like Supabase Edge Functions)
 *    so your API key is not exposed in the frontend code.
 */

/**
 * Generates a random 4-digit numeric OTP code.
 * @returns {string} 4-digit code (e.g. "5821")
 */
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Cleans and normalizes Indian mobile phone numbers.
 * Strips non-digits, and removes the country prefix (91) if it's a 12-digit number.
 * @param {string} phone The raw phone number input
 * @returns {string} Clean 10-digit phone number or raw cleaned digits
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  // If it is 12 digits and starts with '91', strip it to get the 10-digit number
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned.substring(2);
  }
  return cleaned;
};

/**
 * Sends a 4-digit OTP code to the recipient's phone number using the Fast2SMS Bulk V2 OTP API.
 * @param {string} phone Recipient's phone number
 * @param {string} otpCode Generated 4-digit code
 * @returns {Promise<object>} Response data from Fast2SMS API
 */
export const sendFast2SmsOTP = async (phone, otpCode) => {
  const apiKey = import.meta.env.VITE_FAST2SMS_API_KEY;
  if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
    throw new Error('Fast2SMS API key is not configured in environment variables.');
  }

  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone || normalizedPhone.length !== 10) {
    throw new Error(`Invalid phone number "${phone}". A clean 10-digit mobile number is required.`);
  }

  const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      "authorization": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      variables_values: otpCode,
      route: "otp",
      numbers: normalizedPhone
    })
  });

  if (!response.ok) {
    throw new Error(`Fast2SMS API responded with status ${response.status}`);
  }

  const data = await response.json();
  if (!data || data.return !== true) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Unknown error');
    throw new Error(`Fast2SMS Error: ${errorMsg}`);
  }

  return data;
};

/**
 * Sends a 4-digit OTP code to the recipient's email using Resend.
 * @param {string} email Recipient's email address
 * @param {string} name Recipient's full name
 * @param {string} otpCode Generated 4-digit code
 * @returns {Promise<object>} Response data from Resend API
 */
export const sendResendOTP = async (email, name, otpCode) => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  if (!apiKey || apiKey === 'your_resend_api_key_here') {
    throw new Error('Resend API key is not configured in environment variables.');
  }

  if (!email) {
    throw new Error('Email address is required to send OTP.');
  }

  // Attempting to send via Vercel Serverless Function first (Recommended for CORS)
  try {
    const apiRouteResponse = await fetch('/api/sendOtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, otpCode })
    });
    
    if (apiRouteResponse.ok) {
      return await apiRouteResponse.json();
    }
  } catch (err) {
    // Fallback to direct client-side fetch (May throw CORS error on browser, but works in some environments)
    console.warn('Vercel API route failed or not found, falling back to direct Resend API call...', err);
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "EliteClub <onboarding@eliteclubcsn.in>", // Note: Use verified domain for production
      to: [email],
      subject: "Your EliteClub Verification OTP",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
          <h2>EliteClub Check-In</h2>
          <p>Hi ${name || 'Member'},</p>
          <p>Your OTP for verifying your EliteClub check-in is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #d4af37;">${otpCode}</h1>
          <p>Please share this code with the hotel staff. It will expire in 10 minutes.</p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Resend API Error: ${response.status}`);
  }

  return await response.json();
};
