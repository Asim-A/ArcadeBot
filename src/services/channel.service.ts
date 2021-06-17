import { Collection, Guild, GuildMember, Message } from "discord.js";
import { CameraVoiceChannelUser, ChannelContainer } from "../interfaces";
import { dateDiffInSeconds } from "../util/date";
import { botEmbed } from "./embed.service";
import { ROLE_NAMES } from "./role.service";

export const voiceMap = new Collection<string, ChannelContainer>();
const TIME_IN_CHANNEL_THRESHOLD_SECONDS = 5;

export const isProtectedFromDisconnect = (member: GuildMember) => {
  const isAdmin = member.hasPermission(["ADMINISTRATOR"]);
  const hasVoiceProtect =
    member.roles.cache.find((r) => r.name === ROLE_NAMES.vcProt) != null;

  if (isAdmin || hasVoiceProtect) {
    return true;
  }
  return false;
};

export const listVoiceChannel = (message: Message, guildId: string) => {
  const hasGuild = voiceMap.has(guildId);
  if (hasGuild) {
    const g = voiceMap.get(guildId);
    if (g?.channels != null) {
      const channelEmbeds = g.channels.map((_, key) => {
        const embedField = {
          name: "\u200b",
          value: `<#${key}>`,
        };
        return embedField;
      });
      const embed = botEmbed(
        "Voice Channels With Camera Requirement"
      ).addFields(channelEmbeds);

      message.reply(embed);
    }
  }
};

export const checkForCreeps = (guild: Guild) => {
  const channelContainer = voiceMap.get(guild.id);

  if (channelContainer == null) return;

  channelContainer.channels.forEach((userMap, channelId) => {
    const liveChannel = guild.channels.cache.get(channelId);

    if (liveChannel == null || liveChannel.members == null) return;

    liveChannel.members.forEach((memberInChannel) => {
      const hasOnCamera = memberInChannel.voice.selfVideo;
      const isProtected = isProtectedFromDisconnect(memberInChannel);

      if (!hasOnCamera || isProtected) {
        const inLocal = userMap.get(memberInChannel.id);

        if (inLocal == null) {
          userMap.set(memberInChannel.id, {
            user: memberInChannel,
            timeWithCameraOff: new Date(),
          });
        } else {
          const localTime = inLocal.timeWithCameraOff;
          const diffInSeconds = dateDiffInSeconds(localTime);

          if (diffInSeconds >= TIME_IN_CHANNEL_THRESHOLD_SECONDS) {
            inLocal.user.voice.kick();
            const embed = botEmbed("Camera Only Voice Channel").setDescription(
              "You've joined a camera only voice channel. Please turn on your camera to not get disconnected. ✌"
            );
            embed.addField(
              "Voice Channel",
              `<#${liveChannel.id}> <- Click Here To Re-Join Voice Channel.`
            );
            inLocal.user.send(embed);

            userMap.delete(memberInChannel.id);
          }
        }
      }
    });
  });
};

export const getGuildChannelContainer = (
  guildId: string
): ChannelContainer | undefined => {
  const guildExist = voiceMap.has(guildId);

  if (!guildExist) {
    voiceMap.set(guildId, {
      channels: new Collection(),
    });
  }
  const channelContainer = voiceMap.get(guildId);
  return channelContainer;
};

export const getVoiceChannelUsers = (
  guildId: string,
  channelId: string
): Collection<string, CameraVoiceChannelUser> | undefined => {
  const channelContainer = getGuildChannelContainer(guildId);
  if (channelContainer == null) return;
  if (channelContainer.channels == null) {
    channelContainer.channels = new Collection();
  }
  const channelExist = channelContainer?.channels.has(channelId);

  if (!channelExist) {
    channelContainer.channels.set(channelId, new Collection());
  }
  return channelContainer.channels.get(channelId);
};
