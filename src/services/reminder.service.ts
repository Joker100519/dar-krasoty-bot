import type { Env } from "../types/env";

export interface ReminderBooking {

  id: string;

  telegramId: number;

  name: string;

  bookingDate: string;

  startTime: string;

  service: string;

  city: string;

}

export async function getTomorrowReminders(
  env: Env
): Promise<ReminderBooking[]> {

  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const date =
    tomorrow.toISOString().split("T")[0];

  const result = await env.DB.prepare(`
    SELECT

      bookings.id,

      bookings.booking_date,

      bookings.start_time,

      users.telegram_id,

      users.first_name,

      services.name AS service,

      cities.name AS city

    FROM bookings

    INNER JOIN users
      ON users.id = bookings.user_id

    INNER JOIN services
      ON services.id = bookings.service_id

    INNER JOIN cities
      ON cities.id = bookings.city_id

    WHERE

      bookings.status = 'confirmed'

      AND bookings.reminder_sent = 0

      AND bookings.booking_date = ?
  `)
    .bind(date)
    .all<{

      id: string;

      booking_date: string;

      start_time: string;

      telegram_id: number;

      first_name: string;

      service: string;

      city: string;

    }>();

  return result.results.map(row => ({

    id: row.id,

    telegramId: row.telegram_id,

    name: row.first_name,

    bookingDate: row.booking_date,

    startTime: row.start_time,

    service: row.service,

    city: row.city,

  }));

}

export async function markReminderSent(
  env: Env,
  bookingId: string
): Promise<void> {

  await env.DB.prepare(`
    UPDATE bookings

    SET reminder_sent = 1

    WHERE id = ?
  `)
    .bind(bookingId)
    .run();

}