import { MessageEmbed, User } from "discord.js";

export const DEFAULT_AVATAR: string =
  "https://cdn.discordapp.com/embed/avatars/0.png";
export const BOT_AVATAR: string =
  "https://cdn.discordapp.com/avatars/851878281208528916/26abaf6d4782034168bfdba5ed29e429.webp?size=128";
export const BOT_NAME: string = "Smash";
export const EMBED_COLOR: string = "#8A2BEE";

export const standardEmbed = (author: User): MessageEmbed => {
  let authorAvatar: string = DEFAULT_AVATAR;
  if (author.avatarURL() != null) {
    authorAvatar = author.avatarURL() as string;
  }
  const embed = new MessageEmbed();
  embed
    .setColor(EMBED_COLOR)
    .setAuthor(`${author.tag}`, authorAvatar)
    .setTimestamp();
  return embed;
};

export const botEmbed = (title: string): MessageEmbed => {
  const embed = new MessageEmbed()
    .setAuthor(BOT_NAME, BOT_AVATAR)
    .setColor(EMBED_COLOR)
    .setTitle(title)
    .setTimestamp();
  return embed;
};
