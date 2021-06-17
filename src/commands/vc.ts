import {
  GuildChannel,
  GuildChannelManager,
  Message,
  TextChannel,
  User,
} from "discord.js";
import {
  getVoiceChannelUsers,
  isProtectedFromDisconnect,
  listVoiceChannel,
  voiceMap,
} from "../services/channel.service";
import { isNumerical } from "../util/string";
import { RunEvent } from "../interfaces";
import { standardEmbed } from "../services/embed.service";

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

const logToTextChannel = (
  channel?: GuildChannel,
  author?: User,
  command?: string
) => {
  if (
    channel != null &&
    channel.type === "text" &&
    author != null &&
    command != null
  ) {
    const embed = standardEmbed(author);
    embed
      .setTitle(`User Attempted To Use Command Without Sufficient Permission.`)
      .setDescription(
        `User <@${author.id}> attempted to use command: ${command}.`
      );

    (channel as TextChannel).send(embed);
  }
};

const loggableGuildAndChannel = (
  guildId: string,
  message: Message
): GuildChannel | undefined => {
  if (guildId === "377463285718450177") {
    const loggingChannel = message.guild?.channels.cache.find(
      (c) => c.id === "506966760021295123"
    );
    return loggingChannel;
  } else if (guildId === "315008534582657024") {
    const loggingChannel = message.guild?.channels.cache.find(
      (c) => c.id === "415663300026695710"
    );
    return loggingChannel;
  }

  return;
};

export const run = (event: RunEvent) => {
  const { message, args } = event;

  const guildId = message.guild?.id;
  const channelInfo = args[0];
  const channelManager = message.guild?.channels;

  if (message == null || guildId == null) return;
  if (!message.member?.hasPermission(["ADMINISTRATOR"])) {
    // Asim-A 17.06.2021 TODO: This should be extracted to a service for reuse.
    const loggableChannel = loggableGuildAndChannel(guildId, message);
    logToTextChannel(loggableChannel, message.author, event.command);
    return;
  }

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

  const usersWithoutCamera = getVoiceChannelUsers(guildId, channelId);
  if (usersWithoutCamera == null) {
    return;
  }

  channel.members.forEach((member) => {
    const hasCameraOn = member.voice.selfVideo;
    const isProtected = isProtectedFromDisconnect(member);

    if (!hasCameraOn || !isProtected) {
      usersWithoutCamera.set(member.id, {
        user: member,
        timeWithCameraOff: new Date(),
      });
    }
  });

  message.reply(`Channel <#${channelId}> registered. 👀`);
};

export const names = ["vc"];
