// src/utils/admin.ts

import type { Env } from "../types/env";

export function isAdmin(
  env: Env,
  telegramId: number
): boolean {

  return env.ADMIN_IDS
    .split(",")
    .map(id => Number(id.trim()))
    .includes(telegramId);

}