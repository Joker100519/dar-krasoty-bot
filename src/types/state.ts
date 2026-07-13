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

  step: BookingStep;

  service?: string;

  city?: string;

  date?: string;

  time?: string;

  name?: string;

  phone?: string;

  messageId?: number;

  createdAt: string;

  updatedAt: string;
}