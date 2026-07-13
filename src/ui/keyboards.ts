// src/ui/keyboards.ts

import type { InlineKeyboardMarkup } from "../types/telegram";

export function inlineKeyboard(
  rows: { text: string; callback_data: string }[][]
): InlineKeyboardMarkup {
  return {
    inline_keyboard: rows,
  };
}

// =====================================
// Процедуры
// =====================================

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

// =====================================
// Города
// =====================================

export function citiesKeyboard() {
  return inlineKeyboard([
    [{ text: "📍 Москва", callback_data: "city:moscow" }],
    [{ text: "📍 Тула", callback_data: "city:tula" }],
  ]);
}

// =====================================
// Даты
// =====================================

export function datesKeyboard(
  city: string
): InlineKeyboardMarkup {

  const rows: { text: string; callback_data: string }[][] = [];

  const today = new Date();

  for (let i = 0; i < 21; i++) {

    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const weekday = date.getDay();

    let allowed = false;

    if (city === "moscow") {

      // Пн Вт Ср Пт Сб Вс

      allowed =
        weekday === 1 ||
        weekday === 2 ||
        weekday === 3 ||
        weekday === 5 ||
        weekday === 6 ||
        weekday === 0;

    } else {

      // Ср Чт Пт

      allowed =
        weekday === 3 ||
        weekday === 4 ||
        weekday === 5;

    }

    if (!allowed) {
      continue;
    }

    const iso = date.toISOString().split("T")[0];

    rows.push([
      {
        text: date.toLocaleDateString("ru-RU", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        }),
        callback_data: `date:${iso}`,
      },
    ]);

  }

  return inlineKeyboard(rows);

}

// =====================================
// Время
// =====================================

export function timeKeyboard(
  city: string,
  date: string,
  busyTimes: string[]
): InlineKeyboardMarkup {

  const weekday = new Date(date).getDay();

  let hours: number[] = [];

  if (city === "moscow") {

    switch (weekday) {

      case 1:
      case 2:
      case 6:
      case 0:
        hours = [9,10,11,12,13,14,15,16,17,18,19,20];
        break;

      case 3:
        hours = [9,10];
        break;

      case 5:
        hours = [15,16,17,18,19,20];
        break;

      default:
        hours = [];

    }

  } else {

    switch (weekday) {

      case 3:
        hours = [11,12,13,14,15,16,17,18,19,20];
        break;

      case 4:
        hours = [9,10,11,12,13,14,15,16,17,18,19,20];
        break;

      case 5:
        hours = [9,10,11,12,13,14];
        break;

      default:
        hours = [];

    }

  }

  const freeHours = hours.filter(hour => {

    const time =
      `${hour.toString().padStart(2, "0")}:00`;

    return !busyTimes.includes(time);

  });

  return inlineKeyboard(

    freeHours.map(hour => [

      {

        text:
          `${hour.toString().padStart(2, "0")}:00`,

        callback_data:
          `time:${hour.toString().padStart(2, "0")}:00`

      }

    ])

  );

}

// =====================================
// Подтверждение
// =====================================

export function confirmKeyboard() {
  return inlineKeyboard([
    [
      {
        text: "✅ Подтвердить запись",
        callback_data: "confirm",
      },
    ],
    [
      {
        text: "❌ Отменить",
        callback_data: "cancel",
      },
    ],
  ]);
}