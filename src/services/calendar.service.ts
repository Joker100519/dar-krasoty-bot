// src/services/calendar.service.ts

import type { Env } from "../types/env";
import type { UserState } from "../types/state";

function serviceName(code?: string): string {

  switch (code) {

    case "cleaning":
      return "Чистка лица";

    case "massage":
      return "Массаж";

    case "mesotherapy":
      return "Мезотерапия";

    case "peeling":
      return "Пилинг";

    case "masks":
      return "Маски";

    default:
      return "Другое";

  }

}

function addMinutes(
  time: string,
  minutes: number
): string {

  const [h, m] = time
    .split(":")
    .map(Number);

  const date = new Date();

  date.setHours(
    h,
    m + minutes,
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

async function post(
  env: Env,
  body: unknown
): Promise<any> {

  const response = await fetch(
    env.GOOGLE_SCRIPT_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),

    }
  );

  if (!response.ok) {

    throw new Error(
      `Google Script HTTP ${response.status}`
    );

  }

  return response.json();

}

export async function createCalendarEvent(
  env: Env,
  state: UserState
): Promise<string | null> {

  const result = await post(
    env,
    {

      action: "create",

      telegramId:
        state.telegramId,

      name:
        state.name,

      phone:
        state.phone,

      city:
        state.city,

      service:
        serviceName(state.service),

      date:
        state.date,

      start:
        state.time,

      end:
        addMinutes(
          state.time!,
          60
        )

    }
  );

  if (!result.ok) {

    throw new Error(
      result.error ??
      "Google Script error"
    );

  }

  return result.eventId ?? null;

}

export async function deleteCalendarEvent(
  env: Env,
  eventId: string
): Promise<void> {

  const result = await post(
    env,
    {

      action: "delete",

      eventId,

    }
  );

  if (!result.ok) {

    throw new Error(
      result.error ??
      "Не удалось удалить событие"

    );

  }

}

export async function updateCalendarEvent(
  env: Env,
  eventId: string,
  date: string,
  start: string
): Promise<void> {

  const result = await post(
    env,
    {

      action: "update",

      eventId,

      date,

      start,

      end: addMinutes(
        start,
        60
      ),

    }
  );

  if (!result.ok) {

    throw new Error(
      result.error ??
      "Не удалось обновить событие"
    );

  }

}