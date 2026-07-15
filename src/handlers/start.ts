// src/handlers/start.ts

import type { Env } from "../types/env";

import { sendMessage } from "../services/telegram.service";
import { updateState } from "../services/state.service";

import {
  mainMenuKeyboard,
} from "../ui/keyboards";

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
    bookingId: undefined,
  });

  await sendMessage(
    env,
    chatId,
`🌸 <b>Добро пожаловать в "Дар Красоты"</b>

Рады видеть вас!

Выберите нужный раздел:`,
    mainMenuKeyboard()
  );

}