// src/services/booking.service.ts

import type { Env } from "../types/env";

export interface BookingItem {

  id: string;

  bookingDate: string;

  startTime: string;

  endTime: string;

  service: string;

  city: string;

  status: string;

  calendarEventId: string | null;

}

export async function getUserBookings(
  env: Env,
  telegramId: number
): Promise<BookingItem[]> {

  const result = await env.DB.prepare(`
    SELECT

      bookings.id,

      bookings.booking_date,

      bookings.start_time,

      bookings.end_time,

      bookings.status,

      bookings.calendar_event_id,

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

      users.telegram_id = ?

      AND bookings.status = 'confirmed'

    ORDER BY

      bookings.booking_date,
      bookings.start_time

  `)
    .bind(telegramId)
    .all<{

      id: string;

      booking_date: string;

      start_time: string;

      end_time: string;

      service: string;

      city: string;

      status: string;

      calendar_event_id: string | null;

    }>();

  return result.results.map(row => ({

    id: row.id,

    bookingDate: row.booking_date,

    startTime: row.start_time,

    endTime: row.end_time,

    service: row.service,

    city: row.city,

    status: row.status,

    calendarEventId: row.calendar_event_id,

  }));

}

export async function getBookingById(
  env: Env,
  telegramId: number,
  bookingId: string
): Promise<BookingItem | null> {

  const booking = await env.DB.prepare(`
    SELECT

      bookings.id,

      bookings.booking_date,

      bookings.start_time,

      bookings.end_time,

      bookings.status,

      bookings.calendar_event_id,

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

      bookings.id = ?

      AND users.telegram_id = ?

      AND bookings.status = 'confirmed'

  `)
    .bind(
      bookingId,
      telegramId
    )
    .first<{

      id: string;

      booking_date: string;

      start_time: string;

      end_time: string;

      service: string;

      city: string;

      status: string;

      calendar_event_id: string | null;

    }>();

  if (!booking) {
    return null;
  }

  return {

    id: booking.id,

    bookingDate: booking.booking_date,

    startTime: booking.start_time,

    endTime: booking.end_time,

    service: booking.service,

    city: booking.city,

    status: booking.status,

    calendarEventId: booking.calendar_event_id,

  };

}

export async function cancelBooking(
  env: Env,
  bookingId: string
): Promise<void> {

  await env.DB.prepare(`
    UPDATE bookings

    SET

      status = 'cancelled',

      updated_at = CURRENT_TIMESTAMP

    WHERE id = ?
  `)
    .bind(
      bookingId
    )
    .run();

}