import type { Env } from "../types/env";

export interface VisitItem {

  date: string;

  time: string;

  service: string;

  city: string;

  status: string;

}

export async function getClientHistory(
  env: Env,
  clientId: number
): Promise<VisitItem[]> {

  const result = await env.DB.prepare(`
    SELECT

      bookings.booking_date,

      bookings.start_time,

      bookings.status,

      services.name AS service,

      cities.name AS city

    FROM bookings

    INNER JOIN services
      ON services.id = bookings.service_id

    INNER JOIN cities
      ON cities.id = bookings.city_id

    WHERE bookings.user_id = ?

    ORDER BY

      bookings.booking_date DESC,

      bookings.start_time DESC
  `)
    .bind(clientId)
    .all<{

      booking_date: string;

      start_time: string;

      status: string;

      service: string;

      city: string;

    }>();

  return result.results.map(row => ({

    date: row.booking_date,

    time: row.start_time,

    status: row.status,

    service: row.service,

    city: row.city,

  }));

}