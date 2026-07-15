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
  city: string,
  closedDates: string[]
): InlineKeyboardMarkup {

  const rows: {
    text: string;
    callback_data: string;
  }[][] = [];

  const today = new Date();

  for (let i = 0; i < 21; i++) {

    const date = new Date(today);

    date.setDate(
      today.getDate() + i
    );

    const weekday = date.getDay();

    let allowed = false;

    if (city === "moscow") {

      allowed =
        weekday === 1 ||
        weekday === 2 ||
        weekday === 3 ||
        weekday === 5 ||
        weekday === 6 ||
        weekday === 0;

    } else {

      allowed =
        weekday === 3 ||
        weekday === 4 ||
        weekday === 5;

    }

    if (!allowed) {
      continue;
    }

    const iso =
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (closedDates.includes(iso)) {
      continue;
    }

    // Если на дату уже нет доступного времени —
    // не показываем её.
    if (
      getAvailableHours(
        city,
        iso,
        []
      ).length === 0
    ) {
      continue;
    }

    rows.push([
      {
        text: date.toLocaleDateString(
          "ru-RU",
          {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
          }
        ),

        callback_data:
          `date:${iso}`,

      },
    ]);

  }

  return inlineKeyboard(rows);

}

// =====================================
// Время
// =====================================

function getAvailableHours(
  city: string,
  date: string,
  busyTimes: string[]
): number[] {

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
        hours = [9,10,11];
        break;

      case 5:
        hours = [15,16,17,18,19,20];
        break;

    }

  } else {

    switch (weekday) {

      case 3:
        hours = [15,16,17,18,19,20];
        break;

      case 4:
        hours = [9,10,11,12,13,14,15,16,17,18,19,20];
        break;

      case 5:
        hours = [9,10,11];
        break;

    }

  }

  const now = new Date();

  const todayIso =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return hours.filter(hour => {

    const time =
      `${hour.toString().padStart(2, "0")}:00`;

    // Уже занято
    if (busyTimes.includes(time)) {
      return false;
    }

    // Для сегодняшнего дня
    if (date === todayIso) {

      const slot = new Date();

      slot.setHours(
        hour,
        0,
        0,
        0
      );

      const diff =
        slot.getTime() - now.getTime();

      // Минимум за 2 часа
      if (diff < 2 * 60 * 60 * 1000) {
        return false;
      }

    }

    return true;

  });

}

export function timeKeyboard(
  city: string,
  date: string,
  busyTimes: string[]
): InlineKeyboardMarkup {

  const freeHours =
    getAvailableHours(
      city,
      date,
      busyTimes
    );

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
// Подтверждение записи
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

// =====================================
// Мои записи
// =====================================

export function myBookingsKeyboard(
  bookingId: string
): InlineKeyboardMarkup {

  return inlineKeyboard([

    [
      {
        text: "✏️ Перенести запись",
        callback_data: `reschedule_booking:${bookingId}`,
      },
    ],

    [
      {
        text: "❌ Отменить запись",
        callback_data: `cancel_booking:${bookingId}`,
      },
    ],

  ]);

}

// =====================================
// Подтверждение отмены
// =====================================

export function confirmCancelKeyboard(
  bookingId: string
): InlineKeyboardMarkup {

  return inlineKeyboard([

    [
      {
        text: "✅ Да, отменить",
        callback_data: `confirm_cancel:${bookingId}`,
      },
    ],

    [
      {
        text: "↩️ Назад",
        callback_data: "my_bookings",
      },
    ],

  ]);

}

// =====================================
// Подтверждение переноса
// =====================================

export function confirmRescheduleKeyboard(): InlineKeyboardMarkup {

  return inlineKeyboard([

    [
      {
        text: "✅ Подтвердить перенос",
        callback_data: "confirm_reschedule",
      },
    ],

    [
      {
        text: "❌ Отмена",
        callback_data: "cancel",
      },
    ],

  ]);

}

// =====================================
// Админ: выбор города
// =====================================

export function adminCloseCityKeyboard() {

  return inlineKeyboard([

    [
      {
        text: "📍 Москва",
        callback_data: "admin_close_city:moscow",
      },
    ],

    [
      {
        text: "📍 Тула",
        callback_data: "admin_close_city:tula",
      },
    ],

  ]);

}

export function adminOpenCityKeyboard() {

  return inlineKeyboard([

    [
      {
        text: "📍 Москва",
        callback_data: "admin_open_city:moscow",
      },
    ],

    [
      {
        text: "📍 Тула",
        callback_data: "admin_open_city:tula",
      },
    ],

  ]);

}

// =====================================
// Админ: выбор даты
// =====================================

export function adminDatesKeyboard(
  action: "close" | "open",
  city: string,
  closedDates: string[]
): InlineKeyboardMarkup {

  const rows: {
    text: string;
    callback_data: string;
  }[][] = [];

  const today = new Date();

  for (let i = 0; i < 21; i++) {

    const date = new Date(today);

    date.setDate(
      today.getDate() + i
    );

    const iso =
  date.toISOString().split("T")[0];

    const isClosed =
  closedDates.includes(iso);

if (
  action === "close" &&
  isClosed
) {
  continue;
}

if (
  action === "open" &&
  !isClosed
) {
  continue;
}

    rows.push([
      {
        text: date.toLocaleDateString(
          "ru-RU",
          {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
          }
        ),

        callback_data:
          `admin_${action}_date:${city}:${iso}`,

      },
    ]);

  }

  return inlineKeyboard(rows);

}

// =====================================
// Клиенты (админ)
// =====================================

export function clientsKeyboard(
  clients: {
    id: number;
    name: string;
  }[]
): InlineKeyboardMarkup {

  return inlineKeyboard(

    clients.map(client => [

      {

        text: `👤 ${client.name}`,

        callback_data:
          `client:${client.id}`

      }

    ])

  );

}
// =====================================
// Карточка клиента (админ)
// =====================================

export function clientCardKeyboard(
  clientId: number
): InlineKeyboardMarkup {

  return inlineKeyboard([

    [
      {
        text: "📖 История посещений",
        callback_data: `client_history:${clientId}`,
      },
    ],

  ]);

}

// =====================================
// Главное меню
// =====================================

export function mainMenuKeyboard(): InlineKeyboardMarkup {

  return inlineKeyboard([

    [
      {
        text: "🌸 Записаться",
        callback_data: "menu_booking",
      },
    ],

    [
      {
        text: "📅 Мои записи",
        callback_data: "menu_my",
      },
    ],

    [
      {
        text: "📞 Контакты",
        callback_data: "menu_contact",
      },
    ],

    [
      {
        text: "ℹ️ О салоне",
        callback_data: "menu_about",
      },
    ],

  ]);

}