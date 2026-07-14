// src/services/schedule.service.ts

import type { Env } from "../types/env";

export async function getBusyTimes(
  env: Env,
  city: string,
  date: string
): Promise<string[]> {

  const result = await env.DB.prepare(`
    SELECT
      bookings.start_time
    FROM bookings
    INNER JOIN cities
      ON cities.id = bookings.city_id
    WHERE
      cities.code = ?
      AND bookings.booking_date = ?
      AND bookings.status = 'confirmed'
    ORDER BY bookings.start_time
  `)
    .bind(city, date)
    .all<{ start_time: string }>();

  return result.results.map(
    row => row.start_time
  );

}

export async function isTimeBusy(
  env: Env,
  city: string,
  date: string,
  time: string
): Promise<boolean> {

  const busyTimes = await getBusyTimes(
    env,
    city,
    date
  );

  return busyTimes.includes(time);

}

export async function getClosedDates(
  env: Env,
  city: string
): Promise<string[]> {

  const result = await env.DB.prepare(`
    SELECT
      closed_dates.date
    FROM closed_dates
    INNER JOIN cities
      ON cities.id = closed_dates.city_id
    WHERE cities.code = ?
  `)
    .bind(city)
    .all<{ date: string }>();

  return result.results.map(
    row => row.date
  );

}

export async function isDateClosed(
  env: Env,
  city: string,
  date: string
): Promise<boolean> {

  const closedDates = await getClosedDates(
    env,
    city
  );

  return closedDates.includes(date);

}