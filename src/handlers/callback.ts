import type { Env } from "./types";

import { updateState } from "./state";

import { sendMessage } from "./telegram";

import {
  citiesKeyboard,
  datesKeyboard,
  timeKeyboard,
} from "./keyboards";

export async function handleCallback(
  env: Env,
  callback: any
) {
  const chatId = callback.message.chat.id;
  const data = callback.data as string;

  // =====================================
  // Выбор процедуры
  // =====================================

  if (data.startsWith("service:")) {

    const service = data.replace("service:", "");

    await updateState(env, chatId, {
      step: "city",
      service,
      updatedAt: new Date().toISOString(),
    });

    await sendMessage(
      env,
      chatId,
      "📍 Выберите город:",
      citiesKeyboard()
    );

    return;
  }

  // =====================================
  // Выбор города
  // =====================================

  if (data.startsWith("city:")) {

    const city = data.replace("city:", "");

    await updateState(env, chatId, {
      step: "date",
      city,
      updatedAt: new Date().toISOString(),
    });

    await sendMessage(
      env,
      chatId,
      "📅 Выберите дату:",
      datesKeyboard()
    );

    return;
  }

  // =====================================
  // Выбор даты
  // =====================================

  if (data.startsWith("date:")) {

    const date = data.replace("date:", "");

    await updateState(env, chatId, {
      step: "time",
      date,
      updatedAt: new Date().toISOString(),
    });

    await sendMessage(
      env,
      chatId,
      "🕒 Выберите время:",
      timeKeyboard()
    );

    return;
  }

  // =====================================
  // Выбор времени
  // =====================================

  if (data.startsWith("time:")) {

    const time = data.replace("time:", "");

    await updateState(env, chatId, {
      step: "name",
      time,
      updatedAt: new Date().toISOString(),
    });

    await sendMessage(
      env,
      chatId,
      "✍️ Введите ваше имя:"
    );

    return;
  }
}