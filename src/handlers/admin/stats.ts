import type { Env } from "../../types/env";

import {
  getStats,
} from "../../services/stats.service";

import {
  sendMessage,
} from "../../services/telegram.service";

export async function handleStats(
  env: Env,
  chatId: number
): Promise<void> {

  const stats =
    await getStats(env);

  let text =
`📊 <b>Статистика</b>

👥 Клиентов: ${stats.clients}

📅 Активных записей: ${stats.bookings}
`;

  // =====================================
  // Города
  // =====================================

  if (stats.cities.length > 0) {

    text += `

🏙 <b>По городам</b>

`;

    for (const city of stats.cities) {

      text +=
`• ${city.name} — ${city.total}
`;

    }

  }

  // =====================================
  // Услуги
  // =====================================

  if (stats.services.length > 0) {

    text += `

💆 <b>По услугам</b>

`;

    for (const service of stats.services) {

      text +=
`• ${service.name} — ${service.total}
`;

    }

  }

  await sendMessage(
    env,
    chatId,
    text
  );

}