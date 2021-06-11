import { RunEvent } from "../interfaces/interfaces";

export const run = (event: RunEvent) => {
  event.message.reply("Bot Working!");
};

export const names = ["confirm"];
