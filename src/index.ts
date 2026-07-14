import { Hono } from "hono";

import type { Env } from "./types";

import { webhookHandler } from "./handlers/webhook";
import { sendReminders } from "./handlers/reminder";
import { sendDailyReport } from "./handlers/admin/daily-report";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Dar Krasoty Bot OK 🌸");
});

app.post("/webhook", webhookHandler);

export default {

  fetch: app.fetch,

  async scheduled(
    _event: ScheduledEvent,
    env: Env
  ) {

    console.log("Cron started");

    // Напоминания клиентам
    await sendReminders(env);

    // Отчёт администраторам
    const adminIds = (env.ADMIN_IDS ?? "")
      .split(",")
      .map(id => Number(id.trim()))
      .filter(id => !Number.isNaN(id));

    for (const adminId of adminIds) {

      try {

        await sendDailyReport(
          env,
          adminId
        );

      } catch (error) {

        console.error(
          `Daily report error for ${adminId}`,
          error
        );

      }

    }

    console.log("Cron finished");

  },

};