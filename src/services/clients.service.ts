import type { Env } from "../types/env";

export interface ClientItem {

  id: number;

  name: string;

  phone: string | null;

  visits: number;

}

export async function getClients(
  env: Env
): Promise<ClientItem[]> {

  const result = await env.DB.prepare(`
    SELECT

      users.id,

      users.first_name,

      users.phone,

      COUNT(bookings.id) AS visits

    FROM users

    LEFT JOIN bookings
      ON bookings.user_id = users.id

    GROUP BY users.id

    ORDER BY

      visits DESC,

      users.first_name
  `)
  .all<{

    id: number;

    first_name: string;

    phone: string | null;

    visits: number;

  }>();

  return result.results.map(client => ({

    id: client.id,

    name: client.first_name,

    phone: client.phone,

    visits: Number(client.visits),

  }));

}