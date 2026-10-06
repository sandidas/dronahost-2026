/**
 * The renewal line shown under every plan price that is on display.
 *
 * The renewal price always shows ("Renews at $X/month"), taken from `pricing.renewal` in data/pricing.json, which holds an
 * explicit value per plan and currency (it is never derived from the signup price). The promise wording ("same price, no
 * increase") is a claim: it renders only when `promiseVisible` is true, which callers set from
 * `isVerified("renewal-price-same")` (verified AND its terms page published), and only when the data really says the
 * renewal price equals the signup price.
 */
export const RENEWAL_PROMISE = "same price, no increase";

export function renewalLine(renewal: string | null, options: { promiseVisible: boolean; sameAsSignup: boolean; period?: string }): string | null {
  if (!renewal) return null;
  const { promiseVisible, sameAsSignup, period = "month" } = options;
  const base = `Renews at ${renewal}/${period}`;
  return promiseVisible && sameAsSignup ? `${base} — ${RENEWAL_PROMISE}` : base;
}
