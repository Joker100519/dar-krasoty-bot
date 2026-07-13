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

export async function createCalendarEvent(
  env: Env,
  state: UserState
): Promise<string | null> {

  const response = await fetch(
    env.GOOGLE_SCRIPT_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

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

      })

    }
  );

  if (!response.ok) {

    throw new Error(
      `Google Script HTTP ${response.status}`
    );

  }

  const result = await response.json() as {

    ok: boolean;

    eventId?: string;

    error?: string;

  };

  if (!result.ok) {

    throw new Error(
      result.error ??
      "Google Script error"
    );

  }

  return result.eventId ?? null;

}