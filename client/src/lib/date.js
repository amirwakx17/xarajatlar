const MONTHS_LONG = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

const MONTHS_SHORT = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

function pad(value) {
  return String(value).padStart(2, "0");
}

export function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function currentMonth() {
  return todayISO().slice(0, 7);
}

export function formatDate(iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

export function formatLongDate(date = new Date()) {
  return `${date.getDate()} ${MONTHS_LONG[date.getMonth()]}, ${date.getFullYear()}`;
}

export function monthLabel(key) {
  if (!key) return "";
  const [year, month] = key.split("-");
  return `${MONTHS_LONG[Number(month) - 1]} ${year}`;
}

export function monthShort(key) {
  return MONTHS_SHORT[Number(key.slice(5, 7)) - 1];
}
