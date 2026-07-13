export function inlineKeyboard(
  rows: { text: string; callback_data: string }[][]
) {
  return {
    inline_keyboard: rows,
  };
}

export function servicesKeyboard() {
  return inlineKeyboard([
    [{ text: "💆 Чистка лица", callback_data: "service:cleaning" }],
    [{ text: "💆 Массаж", callback_data: "service:massage" }],
    [{ text: "💉 Мезотерапия", callback_data: "service:mesotherapy" }],
    [{ text: "✨ Пилинг", callback_data: "service:peeling" }],
    [{ text: "🌿 Маски", callback_data: "service:masks" }],
    [{ text: "➕ Другое", callback_data: "service:other" }],
  ]);
}

export function citiesKeyboard() {
  return inlineKeyboard([
    [{ text: "📍 Москва", callback_data: "city:moscow" }],
    [{ text: "📍 Тула", callback_data: "city:tula" }],
  ]);
}

export function datesKeyboard() {
  const rows: { text: string; callback_data: string }[][] = [];

  const today = new Date();

  for (let i = 0; i < 21; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const iso = date.toISOString().split("T")[0];

    const text = date.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

    rows.push([
      {
        text,
        callback_data: `date:${iso}`,
      },
    ]);
  }

  return inlineKeyboard(rows);
}

export function timeKeyboard() {
  return inlineKeyboard([
    [{ text: "10:00", callback_data: "time:10:00" }],
    [{ text: "11:00", callback_data: "time:11:00" }],
    [{ text: "12:00", callback_data: "time:12:00" }],
    [{ text: "13:00", callback_data: "time:13:00" }],
    [{ text: "14:00", callback_data: "time:14:00" }],
    [{ text: "15:00", callback_data: "time:15:00" }],
    [{ text: "16:00", callback_data: "time:16:00" }],
    [{ text: "17:00", callback_data: "time:17:00" }],
    [{ text: "18:00", callback_data: "time:18:00" }],
    [{ text: "19:00", callback_data: "time:19:00" }],
  ]);
}