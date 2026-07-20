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

export interface RefundAmountCheck {
  valid: boolean;
  reason?: string;
}

/**
 * Pure validity check for refunding deposited funds to the original card.
 *
 * Gated on `refundable`, not on the spendable balance: a top-up with no recorded Paystack
 * transaction id cannot be sent back to source, so the two numbers can differ and the
 * lower one is the real ceiling. Telling the user "you have ₦5,000" and then rejecting a
 * ₦5,000 refund is exactly the mismatch this avoids.
 *
 * Returns a reason as well as a boolean, unlike `isDepositAmountValid`, because the
 * refund form has no fixed bounds to show as static helper text — the ceiling is
 * per-account, so the failure has to explain itself.
 *
 * Deliberately mirrors `lib/wallet.ts` in the mobile app.
 */
export function isRefundAmountValid(
  amount: number,
  { refundable }: { refundable: number }
): RefundAmountCheck {
  if (!Number.isFinite(amount)) {
    return { valid: false, reason: 'Enter an amount.' };
  }
  if (amount <= 0) {
    return { valid: false, reason: 'Enter an amount greater than zero.' };
  }
  if (refundable <= 0) {
    return { valid: false, reason: 'You have no deposited funds to refund.' };
  }
  if (amount > refundable) {
    return {
      valid: false,
      reason: `You can refund up to ₦${refundable.toLocaleString()}.`,
    };
  }
  return { valid: true };
}

export interface CheckoutSplit {
  /** What the wallet will cover. */
  wallet: number;
  /** What the card will be charged. Zero means no Paystack redirect happens at all. */
  card: number;
}

/**
 * Preview how an order total will divide between wallet and card.
 *
 * The server decides this for real — see plan_split in transactions/wallet_checkout.py —
 * and this mirrors it so the checkout page can show the split before the customer commits.
 * If the two ever disagree, the number on screen is a promise the server will break.
 *
 * Deliberately mirrors `lib/wallet.ts` in the mobile app.
 */
export function planCheckoutSplit(total: number, walletBalance: number): CheckoutSplit {
  if (!Number.isFinite(total) || total <= 0) {
    return { wallet: 0, card: 0 };
  }
  if (!Number.isFinite(walletBalance) || walletBalance <= 0) {
    return { wallet: 0, card: total };
  }
  const wallet = Math.min(walletBalance, total);
  return { wallet, card: Math.max(0, total - wallet) };
}
