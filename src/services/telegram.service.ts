// src/services/telegram.service.ts

import type { Env } from "../types/env";
import type { InlineKeyboardMarkup } from "../types/telegram";

type ReplyKeyboardMarkup = {
  keyboard: {
    text: string;
  }[][];
  resize_keyboard?: boolean;
  persistent?: boolean;
};

type ReplyMarkup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup;

function api(env: Env) {
  return `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}`;
}

async function request(
  env: Env,
  method: string,
  body: unknown
) {

  const response = await fetch(
    `${api(env)}/${method}`,
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),

    }
  );

  if (!response.ok) {

    const text =
      await response.text();

    throw new Error(
      `Telegram API ${method}: ${response.status}\n${text}`
    );

  }

  return response.json();

}

export async function sendMessage(
  env: Env,
  chatId: number,
  text: string,
  replyMarkup?: ReplyMarkup
) {

  return request(
    env,
    "sendMessage",
    {

      chat_id: chatId,

      text,

      parse_mode: "HTML",

      reply_markup: replyMarkup,

    }
  );

}

export async function editMessage(
  env: Env,
  chatId: number,
  messageId: number,
  text: string,
  replyMarkup?: ReplyMarkup
) {

  return request(
    env,
    "editMessageText",
    {

      chat_id: chatId,

      message_id: messageId,

      text,

      parse_mode: "HTML",

      reply_markup: replyMarkup,

    }
  );

}

export async function answerCallback(
  env: Env,
  callbackId: string,
  text?: string
) {

  return request(
    env,
    "answerCallbackQuery",
    {

      callback_query_id: callbackId,

      text,

    }
  );

}

export async function deleteMessage(
  env: Env,
  chatId: number,
  messageId: number
) {

  return request(
    env,
    "deleteMessage",
    {

      chat_id: chatId,

      message_id: messageId,

    }
  );

}