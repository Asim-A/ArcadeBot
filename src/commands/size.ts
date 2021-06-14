import { RunEvent } from "../interfaces";

export const run = (event: RunEvent) => {
  const { message } = event;
  const memberCount = message.guild?.memberCount;

  if (memberCount) {
    message.reply(`There are ${memberCount} members on this server.`);
  }
};

export const names = ["size"];
