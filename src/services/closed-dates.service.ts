// src/services/closed-dates.service.ts

import type { Env } from "../types/env";

export async function closeDate(
  env: Env,
  cityCode: string,
  date: string,
  reason = "Закрыто администратором"
): Promise<void> {

  await env.DB.prepare(`
    INSERT INTO closed_dates (

      city_id,

      date,

      reason

    )
    VALUES (

      (
        SELECT id
        FROM cities
        WHERE code = ?
      ),

      ?,

      ?

    )
  `)
    .bind(
      cityCode,
      date,
      reason
    )
    .run();

}

export async function openDate(
  env: Env,
  cityCode: string,
  date: string
): Promise<void> {

  await env.DB.prepare(`
    DELETE FROM closed_dates

    WHERE

      city_id = (

        SELECT id
        FROM cities
        WHERE code = ?

      )

      AND date = ?
  `)
    .bind(
      cityCode,
      date
    )
    .run();

}