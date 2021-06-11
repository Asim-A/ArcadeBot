import { banIllageNames } from "../features/banIllegalNames";
import { CachedMember, RunEvent } from "../interfaces/interfaces";

export const run = (event: RunEvent) => {
  const { message } = event;
  const hasBanPermissions = message?.member?.hasPermission(["BAN_MEMBERS"]);

  if (!hasBanPermissions) {
    message.reply("You have insufficient permission.");
    return;
  }

  const members = message?.guild?.members?.cache;
  if (members == null) {
    message.reply(`This server has no members.`);
    return;
  }

  const bannedPeople: Array<CachedMember> = [];

  for (const member of members) {
    const banned = banIllageNames(member);
    if (banned != null) {
      bannedPeople.push(banned);
    }
  }

  const bannedAmount = bannedPeople.length;
  const hasSuccessfullyBanned = bannedAmount == 0;

  if (hasSuccessfullyBanned) {
    message.reply(`There were no users worth banning.`);
  } else {
    message.reply(
      `There were ${bannedAmount} user found worth banning.\n Cya!`
    );
  }
};

export const names = ["purge"];
