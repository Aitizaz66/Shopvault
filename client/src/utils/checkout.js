import { readStored, writeStored } from "../../../shared/storage.js";
const attempts = new Map();
const session = () => { try { return globalThis.sessionStorage; } catch { return { getItem() {}, setItem() {}, removeItem() {} }; } };
export const checkoutItems = items => items.map(({ product, quantity }) => ({ product, quantity })).sort((a, b) => a.product.localeCompare(b.product));
export function checkoutAttempt(userId, payload) {
  const name = `shopvault:checkout:${userId}`;
  const signature = JSON.stringify(payload);
  const previous = attempts.get(name) || readStored(name, null, session());
  if (previous?.signature === signature) return previous.key;
  const key = crypto.randomUUID();
  const attempt = { signature, key };
  attempts.set(name, attempt);
  writeStored(name, attempt, session());
  return key;
}
export function clearCheckoutAttempt(userId) {
  const name = `shopvault:checkout:${userId}`;
  attempts.delete(name);
  writeStored(name, undefined, session());
}
