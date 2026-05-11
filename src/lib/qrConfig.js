// ═══════════════════════════════════════════════
//  QR URL Configuration
//  Change this when your domain is ready
// ═══════════════════════════════════════════════

// For development: uses current browser origin (localhost:5173)
// For production: set your real domain here
const PRODUCTION_DOMAIN = ''; // e.g. 'https://theeliteclub.in'

/**
 * Returns the full URL for a QR card scan page.
 * When PRODUCTION_DOMAIN is set, uses that.
 * Otherwise, uses the current browser origin.
 * 
 * Example outputs:
 *   Dev:  http://localhost:5173/scan/K002098
 *   Prod: https://theeliteclub.in/scan/K002098
 */
export function getQRScanUrl(cardId) {
  const base = PRODUCTION_DOMAIN || window.location.origin;
  return `${base}/scan/${cardId}`;
}
