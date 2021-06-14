import { MessageEmbed, MessageReaction, User } from "discord.js";
import {
  findMembersWithIllegalNames,
} from "../features/banIllegalNames";
import { CachedMember, RunEvent } from "../interfaces";

const REPLY_TIMEOUT = 30000;
const DEFAULT_AVATER = "https://cdn.discordapp.com/embed/avatars/0.png";
const CONFIRM_REACT = "✅";
const CANCEL_REACT = "❌";

export const run = async (event: RunEvent) => {
  const { message } = event;
  const hasBanPermissions = message?.member?.hasPermission(["BAN_MEMBERS"]);

  if (!hasBanPermissions) {
    message.reply("You have insufficient permission.");
    return;
  }

  const members = await message?.guild?.members.fetch();
  if (members == null) {
    message.reply(`This server has no members.`);
    return;
  }

  const bannedPeople: Array<CachedMember> =
    findMembersWithIllegalNames(members);

  const bannedAmount = bannedPeople.length;
  const noBanned = bannedAmount == 0;

  if (noBanned) {
    message.reply(`There were no users worth banning.`);
  } else {
    let worthBanning: string = `There were ${bannedAmount} user found worth banning.\n\n`;
    let bannableUsers: string = "";

    const { author } = message;
    let authorAvatar: string = DEFAULT_AVATER;

    if (author.avatarURL() != null) {
      authorAvatar = author.avatarURL() as string;
    }
    const embed = new MessageEmbed();
    embed
      .setColor("#4b0082")
      .setTitle(`Purge\nThere were ${bannedAmount} user found worth banning.\n`)
      .setAuthor(`${author.tag}`, authorAvatar)
      .setDescription("Do you wish to ban these accounts?");

    for (let member of bannedPeople) {
      const { userId, guildMember } = member;

      const msg = `<@${userId}> : ${guildMember.user.tag}\n`;
      bannableUsers += msg;
    }
    embed.setTimestamp();

    message.reply(worthBanning);
    message.channel.send(bannableUsers, { split: true });

    const filter = (reaction: MessageReaction, user: User) => {
      return (
        [CONFIRM_REACT, CANCEL_REACT].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };

    message.channel.send(embed).then((msg) => {
      msg.react(CONFIRM_REACT);
      msg.react(CANCEL_REACT);
      msg
        .awaitReactions(filter, {
          max: 1,
          time: REPLY_TIMEOUT,
          errors: ["time"],
        })
        .then((collected) => {
          const reaction = collected.first();
          const emojiName = reaction?.emoji.name;
          if (emojiName === CONFIRM_REACT) {
            message.reply(`You reacted that you want to ban the users.`);
          } else {
            message.reply(`You reacted that you do not want to ban the users.`);
          }
        })
        .catch((collected) => {
          message.reply(
            "You failed to react in time. If you wish you can try purging again."
          );
          message.react("🤷");
        });
    });

    // message
    //   .reply(replyString, {
    //     split: true,
    //   })
    //   .then(() => {
    //     message.channel.awaitMessages();
    //   }); // parse https://discordjs.guide/popular-topics/collectors.html#await-messages
  }
};

export const names = ["purge"];
