export const CURRENCY = "USD";
export const SHIPPING_FEE = 5;
export const FREE_SHIPPING_THRESHOLD = 50;
export const TAX_RATE = 0.1;
export const toCents = (value) => Math.round(Number(value) * 100);
export function calculateTotals(subtotal, { empty = false } = {}) {
  const cents = toCents(subtotal);
  if (!Number.isSafeInteger(cents) || cents < 0) throw new Error("Invalid price");
  const tax = Math.round(cents * TAX_RATE);
  const shipping = empty || cents > toCents(FREE_SHIPPING_THRESHOLD) ? 0 : toCents(SHIPPING_FEE);
  return { itemsPrice: cents / 100, taxPrice: tax / 100, shippingPrice: shipping / 100, totalPrice: (cents + tax + shipping) / 100, currency: CURRENCY };
}
export function cartTotals(items) {
  return calculateTotals(items.reduce((sum, item) => sum + toCents(item.price) * item.quantity, 0) / 100, { empty: items.length === 0 });
}
