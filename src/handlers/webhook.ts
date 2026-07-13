import type { Context } from "hono";

import type { Env } from "../types";
import type { TelegramUpdate } from "../types/telegram";

import { handleCallback } from "./callback";
import { handleMessage } from "./message";

type AppContext = Context<{ Bindings: Env }>;

export async function webhookHandler(c: AppContext) {

  const update =
    await c.req.json<TelegramUpdate>();

  console.log(
    JSON.stringify(update, null, 2)
  );

  try {

    if (update.message) {

      await handleMessage(
        c.env,
        update.message
      );

      return c.text("OK");
    }

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

}