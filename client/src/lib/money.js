export function groupDigits(value) {
  const digits = String(value).replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatSom(value) {
  const number = Math.round(Number(value) || 0);
  const sign = number < 0 ? "−" : "";
  return `${sign}${groupDigits(Math.abs(number))} so'm`;
}

export function formatAmountInput(value) {
  return groupDigits(value);
}

export function parseAmountInput(value) {
  const digits = String(value).replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}
