import type { Env } from "../types/env";

export interface ClientDetails {

  id: number;

  name: string;

  phone: string | null;

  visits: number;

  confirmed: number;

  cancelled: number;

  firstVisit: string | null;

  lastDate: string | null;

  lastTime: string | null;

  lastService: string | null;

  lastCity: string |null;

}

export async function getClientById(
  env: Env,
  clientId: number
): Promise<ClientDetails | null> {

  const result = await env.DB.prepare(`
    SELECT

      users.id,

      users.first_name,

      users.phone,

      COUNT(bookings.id) AS visits,

      SUM(
        CASE
          WHEN bookings.status='confirmed'
          THEN 1
          ELSE 0
        END
      ) AS confirmed,

      SUM(
        CASE
          WHEN bookings.status='cancelled'
          THEN 1
          ELSE 0
        END
      ) AS cancelled,

      MIN(bookings.booking_date) AS first_visit,

      MAX(bookings.booking_date) AS last_date

    FROM users

    LEFT JOIN bookings
      ON bookings.user_id = users.id

    WHERE users.id = ?

    GROUP BY users.id
  `)
    .bind(clientId)
    .first<{

      id:number;

      first_name:string;

      phone:string|null;

      visits:number;

      confirmed:number;

      cancelled:number;

      first_visit:string|null;

      last_date:string|null;

    }>();

  if (!result) {

    return null;

  }

  let lastTime: string | null = null;
  let lastService: string | null = null;
  let lastCity: string | null = null;

  if (result.last_date) {

    const booking =
      await env.DB.prepare(`
        SELECT

          bookings.start_time,

          services.name AS service,

          cities.name AS city

        FROM bookings

        INNER JOIN services
          ON services.id = bookings.service_id

        INNER JOIN cities
          ON cities.id = bookings.city_id

        WHERE

          bookings.user_id = ?

          AND bookings.booking_date = ?

        ORDER BY

          bookings.start_time DESC

        LIMIT 1
      `)
      .bind(
        clientId,
        result.last_date
      )
      .first<{

        start_time:string;

        service:string;

        city:string;

      }>();

    if (booking) {

      lastTime = booking.start_time;
      lastService = booking.service;
      lastCity = booking.city;

    }

  }

  return {

    id: result.id,

    name: result.first_name,

    phone: result.phone,

    visits: Number(result.visits),

    confirmed:
      Number(result.confirmed ?? 0),

    cancelled:
      Number(result.cancelled ?? 0),

    firstVisit:
      result.first_visit,

    lastDate:
      result.last_date,

    lastTime,

    lastService,

    lastCity,

  };

}