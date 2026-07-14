import type { Env } from "../types/env";

import { sendMessage } from "../services/telegram.service";

import { isAdmin } from "../utils/admin";

export async function handleHelp(
  env: Env,
  chatId: number
): Promise<void> {

  let text =
`🌸 <b>Dar Krasoty Bot</b>

<b>Для клиентов</b>

/start — новая запись

/my — мои записи
`;

  if (isAdmin(env, chatId)) {

    text += `

━━━━━━━━━━━━

<b>Для администратора</b>

/today — записи на сегодня

/tomorrow — записи на завтра

/week — записи на неделю

/clients — база клиентов

/stats — статистика

/close — закрыть дату

/open — открыть дату

/reporttest — тест утреннего отчёта

/remindtest — тест напоминаний`;

  }

  await sendMessage(
    env,
    chatId,
    text
  );

}