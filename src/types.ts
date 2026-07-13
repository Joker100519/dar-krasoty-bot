export interface Env {
  DB: D1Database;
  BOOKINGS_KV: KVNamespace;

  TELEGRAM_TOKEN: string;

  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;

  CALENDAR_MOSCOW_ID: string;
  CALENDAR_TULA_ID: string;
}

export type BookingStep =
  | "service"
  | "city"
  | "date"
  | "time"
  | "name"
  | "phone"
  | "confirm";

export interface UserState {
  telegramId: number;

  step:
    | "service"
    | "city"
    | "date"
    | "time"
    | "name"
    | "phone"
    | "confirm";

  service?: string;

  city?: string;

  date?: string;

  start?: string;

  end?: string;

  name?: string;

  phone?: string;

  createdAt?: string;

  updatedAt?: string;
}