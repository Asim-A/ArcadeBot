import {
  GuildChannel,
  GuildChannelManager,
  Message,
  MessageEmbed,
} from "discord.js";
import { getVoiceChannelUsers, voiceMap } from "../services/channel.service";
import { isNumerical } from "../util/string";
import { RunEvent } from "../interfaces";

const getChannel = (
  channelInfo?: string,
  channelManager?: GuildChannelManager
): GuildChannel | undefined => {
  if (channelInfo == null || channelManager == null) return;

  const isText: boolean = isNumerical(channelInfo);
  if (!isText) {
    const channel = channelManager.cache.filter(
      (c) => c.name.includes(channelInfo) && c.type === "voice"
    );
    return channel.first();
  } else {
    const channel = channelManager.cache.filter(
      (c) => c.id === channelInfo && c.type === "voice"
    );
    return channel.first();
  }
};

const listVoiceChannel = (message: Message, guildId: string) => {
  if (voiceMap.has(guildId)) {
    const g = voiceMap.get(guildId);
    if (g?.channels != null) {
      const channelEmbeds = g.channels.map((value, key) => {
        const embedField = {
          name: "\u200b",
          value: key,
        };
        return embedField;
      });
      const embed = new MessageEmbed()
        .setAuthor("SMASH")
        .setColor("#603F83FF")
        .setTitle("Voice Channels With Camera Requirement")
        .addFields(channelEmbeds);
      message.channel.send(embed);
    }
  }
};

export const run = (event: RunEvent) => {
  const { message, args } = event;

  const guildId = message.guild?.id;
  const channelInfo = args[0];
  const channelManager = message.guild?.channels;

  if (message == null || guildId == null) return;
  if (args.length == 0) {
    listVoiceChannel(message, guildId);
    return;
  }

  const channel = getChannel(channelInfo, channelManager);
  if (channel == null) return;

  const channelId = channel.id;

  if (voiceMap.get(guildId)?.channels.has(channelId)) {
    voiceMap.get(guildId)?.channels.delete(channelId);
    message.reply(`Channel <#${channelId}> unregistered.`);
    return;
  }

  channel.members.forEach((member) => {
    const hasCameraOn = member.voice.selfVideo;

    if (!hasCameraOn) {
      const usersWithoutCamera = getVoiceChannelUsers(guildId, channelId);
      if (usersWithoutCamera == null) {
        return;
      }

      usersWithoutCamera.set(member.id, {
        user: member,
        timeWithCameraOff: new Date(),
      });
    }
  });

  message.reply(`Channel <#${channelId}> registered. 👀`);
};

export const names = ["vc"];
