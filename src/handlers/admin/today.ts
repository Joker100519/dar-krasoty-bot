import type { Env } from "../../types/env";

import {
  getTodayBookings,
} from "../../services/admin.service";

import {
  sendMessage,
} from "../../services/telegram.service";

import {
  formatDayBookings,
} from "../../utils/admin-message";

export async function handleToday(
  env: Env,
  chatId: number
): Promise<void> {

  const bookings =
    await getTodayBookings(env);

  if (bookings.length === 0) {

    await sendMessage(
      env,
      chatId,
      "📅 На сегодня записей нет."
    );

    return;

  }

  await sendMessage(
    env,
    chatId,
    formatDayBookings(
      "Записи на сегодня",
      bookings
    )
  );

}