// src/handlers/message.ts

import type { Env } from "../types/env";
import type { UserState } from "../types/state";

import type { TelegramMessage } from "../types/telegram";

import {
  createState,
  getState,
  updateState,
} from "../services/state.service";

import { sendMessage } from "../services/telegram.service";

import { confirmKeyboard } from "../ui/keyboards";

import { startBooking } from "./start";

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

export async function handleMessage(
  env: Env,
  message: TelegramMessage
): Promise<void> {

  const chatId = message.chat.id;
  const text = (message.text ?? "").trim();

  // -------------------------
  // Старт
  // -------------------------

  if (text === "/start") {

    await createState(
      env,
      chatId
    );

    await startBooking(
      env,
      chatId
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

  // -------------------------
  // Имя
  // -------------------------

  if (state.step === "name") {

    await updateState(env, chatId, {
      name: text,
      step: "phone",
    });

    await sendMessage(
      env,
      chatId,
      "📱 Введите номер телефона:"
    );

    return;
  }

  // -------------------------
  // Телефон
  // -------------------------

  if (state.step === "phone") {

    const nextState = await updateState(
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