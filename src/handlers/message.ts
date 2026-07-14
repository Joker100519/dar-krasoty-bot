// src/handlers/message.ts

import type { Env } from "../types/env";
import type { UserState } from "../types/state";
import type { TelegramMessage } from "../types/telegram";

import {
  createState,
  getState,
  updateState,
} from "../services/state.service";

import {
  getUserBookings,
} from "../services/booking.service";

import {
  getTodayBookings,
  getTomorrowBookings,
  getWeekBookings,
} from "../services/admin.service";

import { isAdmin } from "../utils/admin";

import { sendMessage } from "../services/telegram.service";

import {
  confirmKeyboard,
  myBookingsKeyboard,
  adminCloseCityKeyboard,
  adminOpenCityKeyboard,
} from "../ui/keyboards";

import { startBooking } from "./start";

import { handleToday } from "./admin/today";

import { handleTomorrow } from "./admin/tomorrow";

import { handleWeek } from "./admin/week";

import { handleStats } from "./admin/stats";

import { handleClients } from "./admin/clients";

import { sendReminders } from "./reminder";

import { sendDailyReport } from "./admin/daily-report";

import { handleHelp } from "./help";

function serviceName(service?: string): string {

  switch (service) {

    case "cleaning":
      return "💆 Чистка лица";

    case "massage":
      return "💆 Массаж";

    case "mesotherapy":
      return "💉 Мезотерапия";

    case "peeling":
      return "✨ Пилинг";

    case "masks":
      return "🌿 Маски";

    default:
      return "➕ Другое";

  }

}

function cityName(city?: string): string {

  switch (city) {

    case "moscow":
      return "Москва";

    case "tula":
      return "Тула";

    default:
      return "-";

  }

}

async function sendConfirmation(
  env: Env,
  chatId: number,
  state: UserState
): Promise<void> {

  await sendMessage(
    env,
    chatId,
`✅ <b>Проверьте запись</b>

Процедура: ${serviceName(state.service)}
Город: ${cityName(state.city)}
Дата: ${state.date}
Время: ${state.time}

Имя: ${state.name}
Телефон: ${state.phone}`,
    confirmKeyboard()
  );

}

function normalizeCity(city: string): string | null {

  switch (city.trim().toLowerCase()) {

    case "moscow":
    case "москва":
      return "moscow";

    case "tula":
    case "тула":
      return "tula";

    default:
      return null;

  }

}

export async function handleMessage(
  env: Env,
  message: TelegramMessage
): Promise<void> {

  const chatId = message.chat.id;
  const text = (message.text ?? "").trim();

  let command = text;

switch (text) {

  case "📝 Записаться":
    command = "/start";
    break;

  case "📅 Мои записи":
    command = "/my";
    break;

  case "ℹ️ Помощь":
    command = "/help";
    break;

  case "📅 Сегодня":
    command = "/today";
    break;

  case "📅 Завтра":
    command = "/tomorrow";
    break;

  case "📆 Неделя":
    command = "/week";
    break;

  case "👥 Клиенты":
    command = "/clients";
    break;

  case "📊 Статистика":
    command = "/stats";
    break;

  case "🔒 Закрыть дату":
    command = "/close";
    break;

  case "🔓 Открыть дату":
    command = "/open";
    break;

}

  // =====================================
  // Старт
  // =====================================

  if (command === "/start") {

    await createState(env, chatId);

    await startBooking(env, chatId);

    return;

  }

// =====================================
// Помощь
// =====================================

if (command === "/help") {

  await handleHelp(
    env,
    chatId
  );

  return;

}

  // =====================================
  // Мои записи
  // =====================================

  if (command === "/my") {

    const bookings = await getUserBookings(
      env,
      chatId
    );

    if (bookings.length === 0) {

      await sendMessage(
        env,
        chatId,
        "📭 У вас нет активных записей."
      );

      return;

    }

    for (const booking of bookings) {

      await sendMessage(
        env,
        chatId,
`📅 <b>${booking.bookingDate}</b>

🕒 ${booking.startTime}–${booking.endTime}

💆 ${booking.service}

📍 ${booking.city}`,
        myBookingsKeyboard(
          booking.id
        )
      );

    }

    return;

  }

  // =====================================
// Сегодня (админ)
// =====================================

if (command === "/today") {

  if (!isAdmin(env, chatId)) {

    await sendMessage(
      env,
      chatId,
      "⛔ Эта команда доступна только администраторам."
    );

    return;

  }

  await handleToday(
    env,
    chatId
  );

  return;

}

 // =====================================
// Завтра (админ)
// =====================================

if (command === "/tomorrow") {

  if (!isAdmin(env, chatId)) {

    await sendMessage(
      env,
      chatId,
      "⛔ Эта команда доступна только администраторам."
    );

    return;

  }

  await handleTomorrow(
    env,
    chatId
  );

  return;

}

  // =====================================
// Неделя (админ)
// =====================================

if (command === "/week") {

  if (!isAdmin(env, chatId)) {

    await sendMessage(
      env,
      chatId,
      "⛔ Эта команда доступна только администраторам."
    );

    return;

  }

  await handleWeek(
    env,
    chatId
  );

  return;

}

// =====================================
// Статистика (админ)
// =====================================

if (command === "/stats") {

  if (!isAdmin(env, chatId)) {

    await sendMessage(
      env,
      chatId,
      "⛔ Эта команда доступна только администраторам."
    );

    return;

  }

  await handleStats(
    env,
    chatId
  );

  return;

}

// =====================================
// Клиенты (админ)
// =====================================

if (command === "/clients") {

  if (!isAdmin(env, chatId)) {

    await sendMessage(
      env,
      chatId,
      "⛔ Эта команда доступна только администраторам."
    );

    return;

  }

  await handleClients(
    env,
    chatId
  );

  return;

}

// =====================================
// Тест ежедневного отчёта (админ)
// =====================================

if (command === "/reporttest") {

  if (!isAdmin(env, chatId)) {

    await sendMessage(
      env,
      chatId,
      "⛔ Эта команда доступна только администраторам."
    );

    return;

  }

  await sendDailyReport(
    env,
    chatId
  );

  return;

}

// =====================================
// Тест напоминаний (админ)
// =====================================

if (command === "/remindtest") {

  if (!isAdmin(env, chatId)) {

    await sendMessage(
      env,
      chatId,
      "⛔ Эта команда доступна только администраторам."
    );

    return;

  }

  await sendReminders(env);

  await sendMessage(
    env,
    chatId,
    "✅ Проверка напоминаний завершена."
  );

  return;

}

// =====================================
// Закрыть дату (админ)
// =====================================

if (command === "/close") {

  if (!isAdmin(env, chatId)) {

    await sendMessage(
      env,
      chatId,
      "⛔ Эта команда доступна только администраторам."
    );

    return;

  }

  await sendMessage(
    env,
    chatId,
    "📍 Выберите город:",
    adminCloseCityKeyboard()
  );

  return;

}

// =====================================
// Открыть дату (админ)
// =====================================

if (command === "/open") {

  if (!isAdmin(env, chatId)) {

    await sendMessage(
      env,
      chatId,
      "⛔ Эта команда доступна только администраторам."
    );

    return;

  }

  await sendMessage(
    env,
    chatId,
    "📍 Выберите город:",
    adminOpenCityKeyboard()
  );

  return;

}

  const state = await getState(
    env,
    chatId
  );

  if (!state) {
    return;
  }

  // =====================================
  // Имя
  // =====================================

  if (state.step === "name") {

    await updateState(
      env,
      chatId,
      {
        name: text,
        step: "phone",
      }
    );

    await sendMessage(
      env,
      chatId,
      "📱 Введите номер телефона:"
    );

    return;

  }

  // =====================================
  // Телефон
  // =====================================

  if (state.step === "phone") {

    const nextState =
      await updateState(
        env,
        chatId,
        {
          phone: text,
          step: "confirm",
        }
      );

    await sendConfirmation(
      env,
      chatId,
      nextState
    );

    return;

  }

}