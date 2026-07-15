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
    | "confirm"
    | "reschedule_date"
    | "reschedule_time"
    | "reschedule_confirm";

  service?: string;

  city?: string;

  date?: string;

  time?: string;

  name?: string;

  phone?: string;

  bookingId?: string;

  createdAt: string;

  updatedAt: string;

}