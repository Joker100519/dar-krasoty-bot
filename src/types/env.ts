export interface Env {
  TELEGRAM_TOKEN: string;

  GOOGLE_SCRIPT_URL: string;

  ADMIN_IDS: string;

  BOOKINGS_KV: KVNamespace;

  DB: D1Database;
}