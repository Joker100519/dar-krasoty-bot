// src/handlers/admin/clients.ts

import type { Env } from "../../types/env";

import {
  getClients,
} from "../../services/clients.service";

import {
  sendMessage,
} from "../../services/telegram.service";

import {
  clientsKeyboard,
} from "../../ui/keyboards";

export async function handleClients(
  env: Env,
  chatId: number
): Promise<void> {

  const clients =
    await getClients(env);

  if (clients.length === 0) {

    await sendMessage(
      env,
      chatId,
      "👥 Клиентов пока нет."
    );

    return;

  }

  await sendMessage(
    env,
    chatId,
`👥 <b>Клиенты</b>

Выберите клиента:`,
    clientsKeyboard(

      clients.map(client => ({

        id: client.id,

        name: client.name,

      }))

    )
  );

}