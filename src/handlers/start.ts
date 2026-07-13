// src/handlers/start.ts

import type { Env } from "../types/env";

import { sendMessage } from "../services/telegram.service";
import { updateState } from "../services/state.service";

import { servicesKeyboard } from "../ui/keyboards";

export async function startBooking(
  env: Env,
  chatId: number
): Promise<void> {

  await updateState(env, chatId, {
    step: "service",
    service: undefined,
    city: undefined,
    date: undefined,
    time: undefined,
    name: undefined,
    phone: undefined,
  });

  await sendMessage(
    env,
    chatId,
    "🌸 <b>Дар Красоты</b>\n\nДобро пожаловать!\n\nВыберите процедуру:",
    servicesKeyboard()
  );
}