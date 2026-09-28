/**
 * Security and Credential Restriction Engine
 * Enforces strict Data Protection & Role-Based Access Control (RBAC).
 * Sensitive landlord/caretaker credentials, direct phone numbers,
 * student PII, and financial M-Pesa records are restricted to authorized
 * Administrators only to protect the house hunting agency business model.
 */

export const PUBLIC_CONTACT = {
  name: 'Kelly Muthusi',
  phone: '+254714038892',
  whatsapp: '254714038892',
} as const;

export const ADMIN_CONFIG = {
  agencyName: 'KU Room Finders Agency Ltd',
  escrowPaybill: '849201',
  escrowAccountName: 'KU-RE HOUSING ESCROW',
} as const;

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${PUBLIC_CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Mask Caretaker / Landlord phone number to enforce agency business protection.
 * In a professional house hunting agency, direct contacts are protected
 * to prevent unauthorized middleman bypass and safeguard client escrow.
 */
export function maskCaretakerPhone(phone?: string, isAdmin: boolean = false): string {
  if (isAdmin && phone) return phone;
  if (!phone) return 'AGENCY RESTRICTED';
  const cleaned = phone.trim();
  if (cleaned.length < 8) return '••••••••';
  const prefix = cleaned.substring(0, 7);
  const suffix = cleaned.substring(cleaned.length - 2);
  return `${prefix} ••• •${suffix} (Admin Vault Locked)`;
}

/**
 * Mask student personal phone numbers to prevent scrapers & unsolicited contact.
 * Format: +254 7•• ••• 390
 */
export function maskPhoneNumber(phone: string, isAdmin: boolean = false): string {
  if (isAdmin || !phone) return phone;
  const cleaned = phone.trim();
  if (cleaned.length < 8) return '••••••••';
  const prefix = cleaned.substring(0, 7);
  const suffix = cleaned.substring(cleaned.length - 3);
  return `${prefix} ••• •${suffix}`;
}

/**
 * Mask Kenyatta University student registration numbers.
 * Format: E37/••••/2023
 */
export function maskRegNumber(regNo: string, isAdmin: boolean = false): string {
  if (isAdmin || !regNo) return regNo;
  const parts = regNo.split('/');
  if (parts.length === 3) {
    return `${parts[0]}/••••/${parts[2]}`;
  }
  return `${regNo.substring(0, 3)}••••`;
}

/**
 * Mask sensitive M-Pesa transaction reference codes.
 * Format: QJ84••••KU
 */
export function maskMpesaCode(code: string, isAdmin: boolean = false): string {
  if (isAdmin || !code) return code;
  if (code.length <= 6) return '••••••';
  const prefix = code.substring(0, 4);
  const suffix = code.substring(code.length - 2);
  return `${prefix}••••${suffix}`;
}

/**
 * Mask Caretaker / Landlord National ID.
 * Format: ••••••45
 */
export function maskNationalId(idNumber?: string, isAdmin: boolean = false): string {
  if (isAdmin && idNumber) return idNumber;
  if (!idNumber) return 'RESTRICTED (ADMIN ONLY)';
  return `••••••${idNumber.slice(-3)}`;
}

/**
 * Mask Caretaker / Landlord payout M-Pesa account.
 */
export function maskPayoutAccount(payout?: string, isAdmin: boolean = false): string {
  if (isAdmin && payout) return payout;
  if (!payout) return 'RESTRICTED (ADMIN ONLY)';
  return `M-PESA (${payout.slice(0, 4)}••••${payout.slice(-2)})`;
}

/**
 * Format currency with Discreet Mode support.
 * When Discreet Mode is active, amounts can be obfuscated to prevent prying eyes.
 */
export function formatDiscreetCurrency(amount: number, isDiscreetMode: boolean = false): string {
  if (isDiscreetMode) {
    return 'KES •••••';
  }
  return `KES ${amount.toLocaleString()}`;
}

/**
 * Generate a unique verification hash for a discreet house hunting clearance pass.
 */
export function generateClearanceHash(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return `SEC-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
}
