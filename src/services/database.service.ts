// src/services/database.service.ts

import type { Env } from "../types/env";
import type { UserState } from "../types/state";

function addMinutes(
  time: string,
  minutes: number
): string {

  const [hours, mins] = time
    .split(":")
    .map(Number);

  const date = new Date();

  date.setHours(
    hours,
    mins + minutes,
    0,
    0
  );

  return date.toLocaleTimeString(
    "ru-RU",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );

}

export async function createBooking(
  env: Env,
  state: UserState,
  calendarEventId?: string
): Promise<void> {

  // =====================================
  // Пользователь
  // =====================================

  let user = await env.DB.prepare(`
    SELECT id
    FROM users
    WHERE telegram_id = ?
  `)
    .bind(state.telegramId)
    .first<{ id: number }>();

  if (!user) {

    await env.DB.prepare(`
      INSERT INTO users (
        telegram_id,
        username,
        first_name,
        phone
      )
      VALUES (?, ?, ?, ?)
    `)
      .bind(
        state.telegramId,
        null,
        state.name,
        state.phone
      )
      .run();

    user = await env.DB.prepare(`
      SELECT id
      FROM users
      WHERE telegram_id = ?
    `)
      .bind(state.telegramId)
      .first<{ id: number }>();

    if (!user) {
      throw new Error(
        "Не удалось создать пользователя"
      );
    }

  }

  // =====================================
  // Услуга
  // =====================================

  const service = await env.DB.prepare(`
    SELECT
      id,
      duration_minutes
    FROM services
    WHERE code = ?
  `)
    .bind(state.service)
    .first<{
      id: number;
      duration_minutes: number;
    }>();

  if (!service) {
    throw new Error(
      `Услуга "${state.service}" не найдена`
    );
  }

  // =====================================
  // Город
  // =====================================

  const city = await env.DB.prepare(`
    SELECT id
    FROM cities
    WHERE code = ?
  `)
    .bind(state.city)
    .first<{ id: number }>();

  if (!city) {
    throw new Error(
      `Город "${state.city}" не найден`
    );
  }

  // =====================================
  // Создание записи
  // =====================================

  await env.DB.prepare(`
    INSERT INTO bookings (

      id,

      user_id,
      service_id,
      city_id,

      booking_date,

      start_time,
      end_time,

      status,

      calendar_event_id

    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(

      crypto.randomUUID(),

      user.id,

      service.id,

      city.id,

      state.date,

      state.time,

      addMinutes(
        state.time!,
        service.duration_minutes
      ),

      "confirmed",

      calendarEventId ?? null

    )
    .run();

}