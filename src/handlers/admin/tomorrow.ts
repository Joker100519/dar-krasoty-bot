import type { Env } from "../../types/env";

import {
  getTomorrowBookings,
} from "../../services/admin.service";

import {
  sendMessage,
} from "../../services/telegram.service";

import {
  formatDayBookings,
} from "../../utils/admin-message";

export async function handleTomorrow(
  env: Env,
  chatId: number
): Promise<void> {

  const bookings =
    await getTomorrowBookings(env);

  if (bookings.length === 0) {

    await sendMessage(
      env,
      chatId,
      "📅 На завтра записей нет."
    );

    return;

  }

  await sendMessage(
    env,
    chatId,
    formatDayBookings(
      "Записи на завтра",
      bookings
    )
  );

}