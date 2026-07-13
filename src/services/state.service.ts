// src/services/state.service.ts

import type { Env } from "../types/env";
import type { UserState } from "../types/state";

const PREFIX = "state:";

function key(telegramId: number) {
  return `${PREFIX}${telegramId}`;
}

export async function getState(
  env: Env,
  telegramId: number
): Promise<UserState | null> {
  const state = await env.BOOKINGS_KV.get(
    key(telegramId),
    "json"
  );

  return state as UserState | null;
}

export async function saveState(
  env: Env,
  state: UserState
): Promise<void> {

  state.updatedAt = new Date().toISOString();

  await env.BOOKINGS_KV.put(
    key(state.telegramId),
    JSON.stringify(state)
  );
}

export async function createState(
  env: Env,
  telegramId: number
): Promise<UserState> {

  const state: UserState = {

    telegramId,

    step: "service",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString()

  };

  await saveState(env, state);

  return state;
}

export async function updateState(
  env: Env,
  telegramId: number,
  patch: Partial<UserState>
): Promise<UserState> {

  const current =
    (await getState(env, telegramId)) ??
    (await createState(env, telegramId));

  const next: UserState = {

    ...current,

    ...patch,

    updatedAt: new Date().toISOString()

  };

  await saveState(env, next);

  return next;
}

export async function deleteState(
  env: Env,
  telegramId: number
): Promise<void> {

  await env.BOOKINGS_KV.delete(
    key(telegramId)
  );
}