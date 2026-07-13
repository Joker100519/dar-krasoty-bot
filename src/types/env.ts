export interface Env {
  TELEGRAM_TOKEN: string;

  GOOGLE_SCRIPT_URL: string;

  BOOKINGS_KV: KVNamespace;

  DB: D1Database;
}