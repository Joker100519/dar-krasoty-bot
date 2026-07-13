import type { Env } from "../types";

const api = (env: Env) =>
  `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}`;

export async function sendMessage(
  env: Env,
  chatId: number,
  text: string,
  replyMarkup?: unknown
) {
  const response = await fetch(`${api(env)}/sendMessage`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }

  return response.json();
}