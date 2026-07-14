// src/services/admin.service.ts

import type { Env } from "../types/env";

export interface AdminBooking {

  date: string;

  time: string;

  service: string;

  city: string;

  client: string;

  phone: string | null;

}

function formatDate(date: Date): string {

  return date
    .toISOString()
    .split("T")[0];

}

export async function getBookingsBetween(
  env: Env,
  start: string,
  end: string
): Promise<AdminBooking[]> {

  const result = await env.DB.prepare(`
    SELECT

      bookings.booking_date,

      bookings.start_time,

      services.name AS service,

      cities.name AS city,

      users.first_name,

      users.phone

    FROM bookings

    INNER JOIN users
      ON users.id = bookings.user_id

    INNER JOIN services
      ON services.id = bookings.service_id

    INNER JOIN cities
      ON cities.id = bookings.city_id

    WHERE

      bookings.booking_date BETWEEN ? AND ?

      AND bookings.status = 'confirmed'

    ORDER BY

      bookings.booking_date,

      bookings.start_time
  `)
    .bind(start, end)
    .all<{

      booking_date: string;

      start_time: string;

      service: string;

      city: string;

      first_name: string;

      phone: string | null;

    }>();

  return result.results.map(row => ({

    date: row.booking_date,

    time: row.start_time,

    service: row.service,

    city: row.city,

    client: row.first_name,

    phone: row.phone,

  }));

}

export async function getTodayBookings(
  env: Env
) {

  const today = formatDate(
    new Date()
  );

  return getBookingsBetween(
    env,
    today,
    today
  );

}

export async function getTomorrowBookings(
  env: Env
) {

  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const date = formatDate(
    tomorrow
  );

  return getBookingsBetween(
    env,
    date,
    date
  );

}

export async function getWeekBookings(
  env: Env
) {

  const start = new Date();

  const end = new Date();

  end.setDate(
    end.getDate() + 6
  );

  return getBookingsBetween(

    env,

    formatDate(start),

    formatDate(end)

  );

}