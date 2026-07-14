import type { Env } from "../../types/env";

import {
  getWeekBookings,
} from "../../services/admin.service";

import {
  sendMessage,
} from "../../services/telegram.service";

import {
  formatWeekBookings,
} from "../../utils/admin-message";

export async function handleWeek(
  env: Env,
  chatId: number
): Promise<void> {

  const bookings =
    await getWeekBookings(env);

  if (bookings.length === 0) {

    await sendMessage(
      env,
      chatId,
      "📅 На ближайшие 7 дней записей нет."
    );

    return;

  }

  await sendMessage(
    env,
    chatId,
    formatWeekBookings(
      bookings
    )
  );

}