export function readStored(key, fallback, storage) {
  try { const value = (storage || globalThis.localStorage)?.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
export function writeStored(key, value, storage) {
  try {
    const target = storage || globalThis.localStorage;
    if (value === undefined) target?.removeItem(key);
    else target?.setItem(key, JSON.stringify(value));
  } catch { /* Keep the active session usable when storage is unavailable or full. */ }
}
