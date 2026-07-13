// src/handlers/callback.ts

import type { Env } from "../types/env";
import type { CallbackQuery } from "../types/telegram";

import {
  getState,
  updateState,
  deleteState,
} from "../services/state.service";

import {
  sendMessage,
  answerCallback,
} from "../services/telegram.service";

import {
  createBooking,
} from "../services/database.service";

import {
  createCalendarEvent,
} from "../services/calendar.service";

import {
  getBusyTimes,
  isTimeBusy,
} from "../services/schedule.service";

import {
  citiesKeyboard,
  datesKeyboard,
  timeKeyboard,
} from "../ui/keyboards";

export async function handleCallback(
  env: Env,
  callback: CallbackQuery
): Promise<void> {

  const chatId = callback.message.chat.id;
  const data = callback.data ?? "";

  await answerCallback(env, callback.id);

  // =====================================
  // Процедура
  // =====================================

  if (data.startsWith("service:")) {

    const service = data.replace("service:", "");

    await updateState(env, chatId, {
      service,
      step: "city",
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
  // Город
  // =====================================

  if (data.startsWith("city:")) {

    const city = data.replace("city:", "");

    await updateState(env, chatId, {
      city,
      step: "date",
    });

    await sendMessage(
      env,
      chatId,
      "📅 Выберите дату:",
      datesKeyboard(city)
    );

    return;
  }

  // =====================================
  // Дата
  // =====================================

  if (data.startsWith("date:")) {

    const date = data.replace("date:", "");

    const state = await updateState(
      env,
      chatId,
      {
        date,
        step: "time",
      }
    );

    const busyTimes = await getBusyTimes(
      env,
      state.city!,
      date
    );

    const keyboard = timeKeyboard(
      state.city!,
      date,
      busyTimes
    );

    if (keyboard.inline_keyboard.length === 0) {

      await sendMessage(
        env,
        chatId,
        `❌ На выбранную дату свободных окон нет.

Пожалуйста, выберите другую дату.`
      );

      return;
    }

    await sendMessage(
      env,
      chatId,
      "🕒 Выберите время:",
      keyboard
    );

    return;
  }

  // =====================================
  // Время
  // =====================================

  if (data.startsWith("time:")) {

    const time = data.replace("time:", "");

    await updateState(env, chatId, {
      time,
      step: "name",
    });

    await sendMessage(
      env,
      chatId,
      "✍️ Введите ваше имя:"
    );

    return;
  }

  // =====================================
  // Подтверждение
  // =====================================

  if (data === "confirm") {

    try {

      const state = await getState(
        env,
        chatId
      );

      if (!state) {

        await sendMessage(
          env,
          chatId,
          "❌ Запись не найдена."
        );

        return;
      }

      const busy = await isTimeBusy(
        env,
        state.city!,
        state.date!,
        state.time!
      );

      if (busy) {

        await sendMessage(
          env,
          chatId,
`❌ Пока вы оформляли запись,
это время уже занял другой клиент.

Пожалуйста, начните запись заново.`
        );

        await deleteState(env, chatId);

        return;
      }

      // =====================================
      // Создаем событие в Google Calendar
      // =====================================

      const calendarEventId =
        await createCalendarEvent(
          env,
          state
        );

      // =====================================
      // Сохраняем запись в D1
      // =====================================

      await createBooking(
        env,
        state,
        calendarEventId ?? undefined
      );

      await sendMessage(
        env,
        chatId,
`🎉 <b>Спасибо!</b>

Ваша запись успешно создана.

📅 Мы уже внесли её в рабочий календарь.

До встречи! 🌸`
      );

      await deleteState(
        env,
        chatId
      );

    } catch (error) {

      console.error(error);

      await sendMessage(
        env,
        chatId,
`❌ Ошибка при создании записи.

${String(error)}`
      );

    }

    return;
  }

  // =====================================
  // Отмена
  // =====================================

  if (data === "cancel") {

    await deleteState(
      env,
      chatId
    );

    await sendMessage(
      env,
      chatId,
      "❌ Запись отменена."
    );

    return;
  }

}