import { MessageEmbed, MessageReaction, User } from "discord.js";
import { findMembersWithIllegalNames } from "../features/banIllegalNames";
import { CachedMember, RunEvent } from "../interfaces";

const REPLY_TIMEOUT = 60000;
const DEFAULT_AVATER = "https://cdn.discordapp.com/embed/avatars/0.png";
const CONFIRM_REACT = "✅";
const CANCEL_REACT = "❌";

const formatBannedMessage = (member: CachedMember) => {
  const { userId, guildMember } = member;
  const msg = `<@${userId}> : ${guildMember.user.tag}\n`;
  return msg;
};

const standardEmbed = (author: User): MessageEmbed => {
  let authorAvatar: string = DEFAULT_AVATER;
  if (author.avatarURL() != null) {
    authorAvatar = author.avatarURL() as string;
  }
  const embed = new MessageEmbed();
  embed.setColor("#4b0082").setAuthor(`${author.tag}`, authorAvatar);
  return embed;
};

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

    const embed = standardEmbed(author).setTitle(
      `Purge\nThere were ${bannedAmount} user found worth banning.\n`
    );

    message.reply(worthBanning);

    if (bannedPeople.length > 25) {
      for (let member of bannedPeople) {
        const msg = formatBannedMessage(member);
        bannableUsers += msg;
      }
      message.channel.send(bannableUsers, { split: true });
    } else {
      for (let member of bannedPeople) {
        const msg = formatBannedMessage(member);
        embed.addField("\u200b", msg);
      }
      embed.setTimestamp();
      message.channel.send(embed);
    }

    const filter = (reaction: MessageReaction, user: User) => {
      return (
        [CONFIRM_REACT, CANCEL_REACT].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };

    const confirmEmbed = standardEmbed(author)
      .setTitle(`Purge\nThere were ${bannedAmount} user found worth banning.\n`)
      .setDescription("Do you wish to ban these accounts?");

    message.channel.send(confirmEmbed).then((msg) => {
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
            message.reply(`Commencing Ban.`);
            for (let member of bannedPeople) {
              member.guildMember.ban();
            }
            message.reply(`Ban Completed.`);
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
  }
};

export const names = ["purge"];
