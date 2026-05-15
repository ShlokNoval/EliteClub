/**
 * EliteClub - OTP Utility
 * 
 * To implement live SMS via Fast2SMS (Free Tier/Cheap in India):
 * 1. Go to fast2sms.com and get an API key.
 * 2. It is highly recommended to call this API from a secure backend (like Supabase Edge Functions)
 *    so your API key is not exposed in the frontend code.
 * 
 * Example Client-Side Code (Not recommended for production due to CORS and Security):
 * 
 * export const sendFast2Sms = async (phone, otpCode) => {
 *   const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
 *     method: "POST",
 *     headers: {
 *       "authorization": "YOUR_API_KEY",
 *       "Content-Type": "application/json"
 *     },
 *     body: JSON.stringify({
 *       variables_values: otpCode,
 *       route: "otp",
 *       numbers: phone
 *     })
 *   });
 *   return response.json();
 * };
 */

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
