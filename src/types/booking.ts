import type { Env } from "../types";
import { sendMessage } from "../services/telegram.service";
import { servicesKeyboard } from "../ui/keyboards";

export async function startBooking(
  env: Env,
  chatId: number
) {
  await sendMessage(
    env,
    chatId,
    "🌸 <b>Дар Красоты</b>\n\nВыберите процедуру:",
    servicesKeyboard()
  );
}