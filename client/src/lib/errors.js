const ERROR_MESSAGES = {
  email: "Email manzil noto'g'ri.",
  password: "Parol kamida 6 belgidan iborat bo'lishi kerak.",
  email_taken: "Bu email allaqachon ro'yxatdan o'tgan.",
  invalid_credentials: "Email yoki parol noto'g'ri.",
  amount: "Summani to'g'ri kiriting.",
  date: "Sanani to'g'ri kiriting.",
  category: "Kategoriyani tanlang.",
  type: "Tur noto'g'ri tanlangan.",
  name: "Kategoriya nomini kiriting.",
  kind: "Kategoriya turini tanlang.",
  exists: "Bunday kategoriya allaqachon mavjud.",
  in_use: "Bu kategoriya ishlatilmoqda, o'chirib bo'lmaydi.",
  not_found: "Ma'lumot topilmadi.",
  unauthorized: "Avval tizimga kiring.",
  server_error: "Server xatosi. Qayta urinib ko'ring.",
  sort: "Saralash usuli noto'g'ri.",
  month: "Oy noto'g'ri tanlangan.",
  invalid_json: "So'rov noto'g'ri yuborildi.",
  network: "Serverga ulanib bo'lmadi. Internet aloqasini tekshiring.",
};

export function errorText(error) {
  const code = error?.code || error?.message;
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.server_error;
}
