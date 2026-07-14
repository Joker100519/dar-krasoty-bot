import type { Env } from "../types/env";

export interface Stats {

  bookings: number;

  clients: number;

  cities: {
    name: string;
    total: number;
  }[];

  services: {
    name: string;
    total: number;
  }[];

}

export async function getStats(
  env: Env
): Promise<Stats> {

  const bookings = await env.DB.prepare(`
    SELECT COUNT(*) AS total
    FROM bookings
    WHERE status = 'confirmed'
  `)
    .first<{ total: number }>();

  const clients = await env.DB.prepare(`
    SELECT COUNT(*) AS total
    FROM users
  `)
    .first<{ total: number }>();

  const cities = await env.DB.prepare(`
    SELECT

      cities.name,

      COUNT(*) AS total

    FROM bookings

    INNER JOIN cities
      ON cities.id = bookings.city_id

    WHERE bookings.status = 'confirmed'

    GROUP BY cities.id

    ORDER BY total DESC
  `)
    .all<{
      name: string;
      total: number;
    }>();

  const services = await env.DB.prepare(`
    SELECT

      services.name,

      COUNT(*) AS total

    FROM bookings

    INNER JOIN services
      ON services.id = bookings.service_id

    WHERE bookings.status = 'confirmed'

    GROUP BY services.id

    ORDER BY total DESC
  `)
    .all<{
      name: string;
      total: number;
    }>();

  return {

    bookings: bookings?.total ?? 0,

    clients: clients?.total ?? 0,

    cities: cities.results,

    services: services.results,

  };

}