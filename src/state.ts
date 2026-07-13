import type { Env, UserState } from "./types";

const PREFIX = "state:";

export async function loadState(
  env: Env,
  telegramId: number
): Promise<UserState | null> {
  const value = await env.BOOKINGS_KV.get(
    PREFIX + telegramId,
    "json"
  );

  return value as UserState | null;
}

export async function saveState(
  env: Env,
  state: UserState
): Promise<void> {
  await env.BOOKINGS_KV.put(
    PREFIX + state.telegramId,
    JSON.stringify(state)
  );
}

export async function clearState(
  env: Env,
  telegramId: number
): Promise<void> {
  await env.BOOKINGS_KV.delete(
    PREFIX + telegramId
  );
}

export async function updateState(
  env: Env,
  telegramId: number,
  patch: Partial<UserState>
): Promise<UserState> {

  const current =
    (await loadState(env, telegramId)) ??
    {
      telegramId,
      step: "service"
    };

  const next: UserState = {
    ...current,
    ...patch
  };

  await saveState(env, next);

  return next;
}