export function clientMenu() {

  return {

    keyboard: [

      [
        { text: "📝 Записаться" }
      ],

      [
        { text: "📅 Мои записи" }
      ],

      [
        { text: "ℹ️ Помощь" }
      ]

    ],

    resize_keyboard: true,

    persistent: true,

  };

}

export function adminMenu() {

  return {

    keyboard: [

      [
        { text: "📅 Сегодня" },
        { text: "📅 Завтра" }
      ],

      [
        { text: "📆 Неделя" },
        { text: "👥 Клиенты" }
      ],

      [
        { text: "📊 Статистика" }
      ],

      [
        { text: "🔒 Закрыть дату" },
        { text: "🔓 Открыть дату" }
      ],

      [
        { text: "ℹ️ Помощь" }
      ]

    ],

    resize_keyboard: true,

    persistent: true,

  };

}