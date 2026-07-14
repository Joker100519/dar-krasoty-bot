import type { Env } from "../types/env";

import {
  getTomorrowReminders,
  markReminderSent,
} from "../services/reminder.service";

import {
  sendMessage,
} from "../services/telegram.service";

export async function sendReminders(
  env: Env
): Promise<void> {

  const bookings =
    await getTomorrowReminders(env);

  console.log(
    `Reminders: ${bookings.length}`
  );

  for (const booking of bookings) {

    try {

      await sendMessage(
        env,
        booking.telegramId,
`🌸 <b>Здравствуйте, ${booking.name}!</b>

Напоминаем, что завтра у вас запись.

📅 ${booking.bookingDate}

🕒 ${booking.startTime}

💆 ${booking.service}

📍 ${booking.city}

Если ваши планы изменились, запись можно отменить командой

/my

До встречи ❤️`
      );

      await markReminderSent(
        env,
        booking.id
      );

      console.log(
        `Reminder sent: ${booking.id}`
      );

    } catch (error) {

      console.error(
        "Reminder error:",
        error
      );

    }

  }

}