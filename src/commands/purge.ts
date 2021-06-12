import {
  banIllegalNames,
  findMembersWithIllegalNames,
} from "../features/banIllegalNames";
import { CachedMember, RunEvent } from "../interfaces";

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

  const bannedPeople: Array<CachedMember> =
    findMembersWithIllegalNames(members);

  const bannedAmount = bannedPeople.length;
  const hasSuccessfullyBanned = bannedAmount == 0;

  if (hasSuccessfullyBanned) {
    message.reply(`There were no users worth banning.`);
  } else {
    let replyString: string = `There were ${bannedAmount} user found worth banning.\n`;

    for (let member of bannedPeople) {
      const { userId, guildMember } = member;

      const msg = `<@${userId}\n>`;
      replyString += msg;
    }

    message
      .reply(replyString, {
        split: true,
      })
      .then((msg) => {}); // parse https://discordjs.guide/popular-topics/collectors.html#await-messages
  }
};

export const names = ["purge"];
