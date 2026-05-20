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
