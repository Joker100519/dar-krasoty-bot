// src/handlers/callback.ts

import type { Env } from "../types/env";
import type { CallbackQuery } from "../types/telegram";

import {
  getState,
  updateState,
  deleteState,
} from "../services/state.service";

import {
  sendMessage,
  answerCallback,
} from "../services/telegram.service";

import {
  createBooking,
} from "../services/database.service";

import {
  getUserBookings,
  getBookingById,
  cancelBooking,
} from "../services/booking.service";

import {
  createCalendarEvent,
  deleteCalendarEvent,
} from "../services/calendar.service";

import {
  closeDate,
  openDate,
} from "../services/closed-dates.service";

import {
  getBusyTimes,
  getClosedDates,
  isTimeBusy,
  isDateClosed,
} from "../services/schedule.service";

import {
  citiesKeyboard,
  datesKeyboard,
  timeKeyboard,
  myBookingsKeyboard,
  confirmCancelKeyboard,
  adminDatesKeyboard,
} from "../ui/keyboards";

import {
  getClientById,
} from "../services/client.service";

import {
  clientCardKeyboard,
} from "../ui/keyboards";

import {
  getClientHistory,
} from "../services/history.service";

export async function handleCallback(
  env: Env,
  callback: CallbackQuery
): Promise<void> {

  const chatId = callback.message.chat.id;
  const data = callback.data ?? "";

  await answerCallback(env, callback.id);

// =====================================
// Админ: выбран город для закрытия
// =====================================

if (data.startsWith("admin_close_city:")) {

  const city = data.replace(
    "admin_close_city:",
    ""
  );

const closedDates =
  await getClosedDates(
    env,
    city
  );

await sendMessage(
  env,
  chatId,
  "📅 Выберите дату:",
  adminDatesKeyboard(
    "close",
    city,
    closedDates
  )
);

return;


}

// =====================================
// Админ: выбран город для открытия
// =====================================

if (data.startsWith("admin_open_city:")) {

  const city = data.replace(
    "admin_open_city:",
    ""
  );

const closedDates =
  await getClosedDates(
    env,
    city
  );

await sendMessage(
  env,
  chatId,
  "📅 Выберите дату:",
  adminDatesKeyboard(
    "open",
    city,
    closedDates
  )
);

return;

} 

// =====================================
// Админ: закрыть дату
// =====================================

if (data.startsWith("admin_close_date:")) {

  const [, city, date] = data.split(":");

  try {

    await closeDate(
      env,
      city,
      date
    );

    await sendMessage(
      env,
      chatId,
`✅ Дата успешно закрыта.

📍 ${city}
📅 ${date}`
    );

  } catch (error) {

    console.error(error);

    await sendMessage(
      env,
      chatId,
`❌ Не удалось закрыть дату.

${String(error)}`
    );

  }

  return;

}

// =====================================
// Админ: открыть дату
// =====================================

if (data.startsWith("admin_open_date:")) {

  const [, city, date] = data.split(":");

  try {

    await openDate(
      env,
      city,
      date
    );

    await sendMessage(
      env,
      chatId,
`✅ Дата успешно открыта.

📍 ${city}
📅 ${date}`
    );

  } catch (error) {

    console.error(error);

    await sendMessage(
      env,
      chatId,
`❌ Не удалось открыть дату.

${String(error)}`
    );

  }

  return;

}

// =====================================
// Карточка клиента (админ)
// =====================================

if (data.startsWith("client:")) {

  const clientId = Number(
    data.replace(
      "client:",
      ""
    )
  );

  const client =
    await getClientById(
      env,
      clientId
    );

  if (!client) {

    await sendMessage(
  env,
  chatId,
  text,
  clientCardKeyboard(
    client.id
  )
);

    return;

  }

const formatDate = (
  date: string | null
): string => {

  if (!date) {
    return "—";
  }

  return new Date(date)
    .toLocaleDateString(
      "ru-RU",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

};

let text =
`👤 <b>${client.name}</b>

`;

if (client.phone) {

  text +=
`📱 ${client.phone}

`;

}

text +=
`📊 <b>Статистика</b>

📅 Всего записей: ${client.visits}

✅ Состоялось: ${client.confirmed}

❌ Отменено: ${client.cancelled}

📆 Первый визит:
${formatDate(client.firstVisit)}

📆 Последний визит:
${formatDate(client.lastDate)}

`;

if (client.lastTime) {

  text +=
`🕒 Последнее время:
${client.lastTime}

`;

}

if (client.lastService) {

  text +=
`💆 Последняя процедура:
${client.lastService}

`;

}

if (client.lastCity) {

  text +=
`📍 Последний город:
${client.lastCity}

`;

}

  await sendMessage(
    env,
    chatId,
    text
  );

  return;

}

// =====================================
// История посещений клиента (админ)
// =====================================

if (data.startsWith("client_history:")) {

  const clientId = Number(
    data.replace(
      "client_history:",
      ""
    )
  );

  const history =
    await getClientHistory(
      env,
      clientId
    );

  if (history.length === 0) {

    await sendMessage(
      env,
      chatId,
      "📭 История посещений отсутствует."
    );

    return;

  }

  let text =
`📖 <b>История посещений</b>

`;

  for (const visit of history) {

let status = "";

switch (visit.status) {

  case "confirmed":
    status = "✅ Состоялась";
    break;

  case "cancelled":
    status = "❌ Отменена";
    break;

  default:
    status = visit.status;

}

const date = new Date(visit.date);

text +=
`📅 ${date.toLocaleDateString(
  "ru-RU",
  {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
)}

🕒 ${visit.time}

💆 ${visit.service}

📍 ${visit.city}

${status}

━━━━━━━━━━━━

`;

  }

  await sendMessage(
    env,
    chatId,
    text
  );

  return;

}

  // =====================================
  // Процедура
  // =====================================

  if (data.startsWith("service:")) {

    const service = data.replace("service:", "");

    await updateState(env, chatId, {
      service,
      step: "city",
    });

    await sendMessage(
      env,
      chatId,
      "📍 Выберите город:",
      citiesKeyboard()
    );

    return;
  }

  // =====================================
  // Город
  // =====================================

  if (data.startsWith("city:")) {

    const city = data.replace("city:", "");

    await updateState(env, chatId, {
      city,
      step: "date",
    });

    const closedDates = await getClosedDates(
      env,
      city
    );

    await sendMessage(
      env,
      chatId,
      "📅 Выберите дату:",
      datesKeyboard(
        city,
        closedDates
      )
    );

    return;
  }

  // =====================================
  // Дата
  // =====================================

  if (data.startsWith("date:")) {

    const date = data.replace("date:", "");

    const state = await getState(
      env,
      chatId
    );

    if (!state || !state.city) {

      await sendMessage(
        env,
        chatId,
        "❌ Начните запись заново."
      );

      return;
    }

    if (
      await isDateClosed(
        env,
        state.city,
        date
      )
    ) {

      await sendMessage(
        env,
        chatId,
        "❌ Эта дата недоступна для записи."
      );

      return;
    }

    const nextState = await updateState(
      env,
      chatId,
      {
        date,
        step: "time",
      }
    );

    const busyTimes = await getBusyTimes(
      env,
      nextState.city!,
      date
    );

    const keyboard = timeKeyboard(
      nextState.city!,
      date,
      busyTimes
    );

    if (keyboard.inline_keyboard.length === 0) {

      await sendMessage(
        env,
        chatId,
        `❌ На выбранную дату свободного времени нет.

Выберите другую дату.`
      );

      return;
    }

    await sendMessage(
      env,
      chatId,
      "🕒 Выберите время:",
      keyboard
    );

    return;
  }

  // =====================================
  // Время
  // =====================================

  if (data.startsWith("time:")) {

    const time = data.replace("time:", "");

    await updateState(
      env,
      chatId,
      {
        time,
        step: "name",
      }
    );

    await sendMessage(
      env,
      chatId,
      "✍️ Введите ваше имя:"
    );

    return;
  }

  // =====================================
  // Подтверждение
  // =====================================

  if (data === "confirm") {

    try {

      const state = await getState(
        env,
        chatId
      );

      if (!state) {

        await sendMessage(
          env,
          chatId,
          "❌ Запись не найдена."
        );

        return;
      }

      if (
        await isTimeBusy(
          env,
          state.city!,
          state.date!,
          state.time!
        )
      ) {

        await sendMessage(
          env,
          chatId,
          `❌ Это время уже занято.

Выберите другое время.`
        );

        return;
      }

      const calendarEventId =
        await createCalendarEvent(
          env,
          state
        );

      await createBooking(
        env,
        state,
        calendarEventId ?? undefined
      );

      await sendMessage(
        env,
        chatId,
`🎉 <b>Спасибо!</b>

Ваша запись успешно создана.

📅 Запись уже появилась в рабочем календаре.

До встречи! 🌸`
      );

      await deleteState(
        env,
        chatId
      );

    } catch (error) {

      console.error(error);

      await sendMessage(
        env,
        chatId,
        `❌ Ошибка записи

${String(error)}`
      );

    }

    return;
  }

  // =====================================
// Нажали "Отменить запись"
// =====================================

if (data.startsWith("cancel_booking:")) {

  const bookingId = data.replace(
    "cancel_booking:",
    ""
  );

  console.log("CHAT ID:", chatId);
console.log("BOOKING ID:", bookingId);

  const booking = await getBookingById(
    env,
    chatId,
    bookingId
  );

  console.log("BOOKING:", booking);

  if (!booking) {

    await sendMessage(
      env,
      chatId,
      "❌ Запись не найдена."
    );

    return;

  }

  await sendMessage(
    env,
    chatId,
`❓ <b>Отменить запись?</b>

📅 ${booking.bookingDate}

🕒 ${booking.startTime}

💆 ${booking.service}

📍 ${booking.city}`,
    confirmCancelKeyboard(
      booking.id
    )
  );

  return;

}

// =====================================
// Подтверждение отмены записи
// =====================================

if (data.startsWith("confirm_cancel:")) {

  const bookingId = data.replace(
    "confirm_cancel:",
    ""
  );

  const booking = await getBookingById(
    env,
    chatId,
    bookingId
  );

  if (!booking) {

    await sendMessage(
      env,
      chatId,
      "❌ Запись не найдена."
    );

    return;

  }

  try {

    if (booking.calendarEventId) {

      await deleteCalendarEvent(
        env,
        booking.calendarEventId
      );

    }

    await cancelBooking(
      env,
      booking.id
    );

    await sendMessage(
      env,
      chatId,
`✅ <b>Запись отменена.</b>

Мы будем рады видеть вас снова 🌸`
    );

  } catch (error) {

    console.error(error);

    await sendMessage(
      env,
      chatId,
`❌ Не удалось отменить запись.

${String(error)}`
    );

  }

  return;

}

// =====================================
// Вернуться к списку записей
// =====================================

if (data === "my_bookings") {

  const bookings = await getUserBookings(
    env,
    chatId
  );

  if (bookings.length === 0) {

    await sendMessage(
      env,
      chatId,
      "📭 У вас нет активных записей."
    );

    return;

  }

  for (const booking of bookings) {

    await sendMessage(
      env,
      chatId,
`📅 <b>${booking.bookingDate}</b>

🕒 ${booking.startTime}–${booking.endTime}

💆 ${booking.service}

📍 ${booking.city}`,
      myBookingsKeyboard(
        booking.id
      )
    );

  }

  return;

}

  // =====================================
  // Отмена
  // =====================================

  if (data === "cancel") {

    await deleteState(
      env,
      chatId
    );

    await sendMessage(
      env,
      chatId,
      "❌ Запись отменена."
    );

    return;
  }

}