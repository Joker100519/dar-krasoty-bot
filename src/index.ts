import { Hono } from "hono";

import type { Env } from "./types";

import { webhookHandler } from "./handlers/webhook";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Dar Krasoty Bot OK 🌸");
});

app.post("/webhook", webhookHandler);

export default app;