import type { AdminBooking } from "../services/admin.service";

export function formatDayBookings(
  title: string,
  bookings: AdminBooking[]
): string {

  let text =
`📅 <b>${title}</b>

`;

  for (const booking of bookings) {

    text +=
`🕒 ${booking.time}
👤 ${booking.client}
💆 ${booking.service}
📍 ${booking.city}`;

    if (booking.phone) {
      text += `\n📱 ${booking.phone}`;
    }

    text += "\n\n";

  }

  return text;

}

export function formatWeekBookings(
  bookings: AdminBooking[]
): string {

  let currentDate = "";

  let text =
`📅 <b>Записи на ближайшие 7 дней</b>

`;

  for (const booking of bookings) {

    if (booking.date !== currentDate) {

      currentDate = booking.date;

      const date = new Date(
        booking.date
      );

      text +=
`\n━━━━━━━━━━━━

📅 <b>${date.toLocaleDateString(
  "ru-RU",
  {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }
)}</b>

`;

    }

    text +=
`🕒 ${booking.time}
👤 ${booking.client}
💆 ${booking.service}
📍 ${booking.city}`;

    if (booking.phone) {
      text += `\n📱 ${booking.phone}`;
    }

    text += "\n\n";

  }

  return text;

}