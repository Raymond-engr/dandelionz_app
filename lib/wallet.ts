/**
 * Fallback minimum withdrawal, in naira.
 *
 * The server is the authority: it enforces `MIN_WITHDRAWAL_NGN` and returns the current
 * value as `min_withdrawal` on the wallet balance endpoint. This constant is only the
 * value used before that response arrives.
 *
 * Deliberately mirrors `lib/wallet.ts` in the mobile app. This page previously hardcoded
 * 100 while mobile used 500 and the server enforced neither, so the same account could
 * withdraw different minimums depending on which app it used.
 */
export const MIN_WITHDRAWAL = 500;

/**
 * Pure validity check for the customer withdrawal form. Bank details come from saved
 * payout settings rather than the form, so this only gates the amount and the 4-digit PIN.
 */
export function isWithdrawFormValid({
  amount,
  pin,
  balance,
  minimum = MIN_WITHDRAWAL,
}: {
  amount: number;
  pin: string;
  balance: number;
  minimum?: number;
}): boolean {
  if (!Number.isFinite(amount)) return false;
  if (amount < minimum) return false;
  if (amount > balance) return false;
  if (pin.length !== 4) return false;
  return true;
}

/**
 * Deposit bounds, in naira. The server enforces these on
 * `POST /transactions/wallet/deposit/` and rejects anything outside them with a 400;
 * these constants only exist so the UI can refuse an obviously bad amount before
 * spending a round trip and a Paystack redirect on it.
 *
 * Deliberately mirrors `lib/wallet.ts` in the mobile app.
 */
export const MIN_DEPOSIT = 100;
export const MAX_DEPOSIT = 500000;

/**
 * Pure validity check for a wallet top-up amount.
 *
 * Note this is NOT symmetric with `isWithdrawFormValid`: a deposit is not gated on the
 * wallet balance, and deposited funds land in the spendable bucket, which can be spent
 * at checkout but never withdrawn to a bank.
 */
export function isDepositAmountValid(
  amount: number,
  {
    min = MIN_DEPOSIT,
    max = MAX_DEPOSIT,
  }: { min?: number; max?: number } = {}
): boolean {
  if (!Number.isFinite(amount)) return false;
  if (amount < min) return false;
  if (amount > max) return false;
  return true;
}
