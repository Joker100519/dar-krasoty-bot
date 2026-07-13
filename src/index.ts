import { Hono } from "hono";

import type { Env } from "./types";

import { startBooking } from "./booking";

import { saveState } from "./state";

import { handleCallback } from "./callback";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Дар Красоты Bot работает 🌸");
});

app.post("/webhook", async (c) => {

  const update = await c.req.json();

  console.log(JSON.stringify(update, null, 2));

  try {

    // =====================================
    // Сообщения
    // =====================================

    if (update.message) {

      const chatId = update.message.chat.id;
      const text = update.message.text ?? "";

      if (text === "/start") {

        await saveState(c.env, {
          telegramId: chatId,
          step: "service",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        await startBooking(
          c.env,
          chatId
        );
      }

      return c.text("OK");
    }

    // =====================================
    // Нажатия на inline-кнопки
    // =====================================

    if (update.callback_query) {

      await handleCallback(
        c.env,
        update.callback_query
      );

      return c.text("OK");
    }

    return c.text("OK");

  } catch (error) {

    console.error(error);

    return c.text("ERROR");

  }

});

export default app;