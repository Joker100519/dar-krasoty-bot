import type { Env } from "../../types/env";

import {
  getTodayBookings,
} from "../../services/admin.service";

import {
  sendMessage,
} from "../../services/telegram.service";

export async function sendDailyReport(
  env: Env,
  adminId: number
): Promise<void> {

  const bookings =
    await getTodayBookings(env);

  if (bookings.length === 0) {

    await sendMessage(
      env,
      adminId,
      "📅 Доброе утро!\n\nНа сегодня записей нет."
    );

    return;

  }

  let text =
`🌸 <b>Доброе утро!</b>

📅 <b>Записи на сегодня</b>

`;

  for (const booking of bookings) {

    text +=
`🕒 ${booking.time}

👤 ${booking.client}

💆 ${booking.service}

📍 ${booking.city}`;

    if (booking.phone) {

      text +=
`\n📱 ${booking.phone}`;

    }

    text += "\n\n";

  }

  await sendMessage(
    env,
    adminId,
    text
  );

}