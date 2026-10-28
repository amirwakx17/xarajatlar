const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function isEmail(value) {
  return typeof value === "string" && value.length <= 120 && EMAIL_RE.test(value);
}

export function isPassword(value) {
  return typeof value === "string" && value.length >= 6 && value.length <= 100;
}

export function parseAmount(value) {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 && value <= 1e12 ? value : null;
  }
  if (typeof value !== "string") return null;
  const digits = value.replace(/[\s\u00a0']/g, "");
  if (!/^\d{1,13}$/.test(digits)) return null;
  const amount = Number(digits);
  return Number.isSafeInteger(amount) && amount > 0 && amount <= 1e12 ? amount : null;
}

export function isValidDate(value) {
  if (typeof value !== "string") return false;
  const match = DATE_RE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

export function isValidMonth(value) {
  return typeof value === "string" && MONTH_RE.test(value);
}

export function cleanText(value, maxLength = 120) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function isValidColor(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}
