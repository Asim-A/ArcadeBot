import { Collection, Guild } from "discord.js";
import { CameraVoiceChannelUser, ChannelContainer } from "../interfaces";
import { dateDiffInSeconds } from "../util/date";

export const voiceMap = new Collection<string, ChannelContainer>();
const TIME_IN_CHANNEL_THRESHOLD_SECONDS = 10;

export const checkForCreeps = (guild: Guild) => {
  const channelContainer = voiceMap.get(guild.id);

  if (channelContainer == null) return;

  channelContainer.channels.forEach((userMap, channelId) => {
    const liveChannel = guild.channels.cache.get(channelId);

    if (liveChannel == null || liveChannel.members == null) return;

    liveChannel.members.forEach((memberInChannel) => {
      const hasOnCamera = memberInChannel.voice.selfVideo;
      if (!hasOnCamera) {
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
            inLocal.user.send(
              "You've joined a camera only voice. Please turn on your camera to not get disconnected. ✌"
            );
            userMap.delete(memberInChannel.id);
          }
        }
      }
    });
  });
};

export const getChannelContainer = (
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
  const channelContainer = getChannelContainer(guildId);

  const channelExist = channelContainer?.channels.has(channelId);
  if (channelContainer == null || channelContainer.channels == null) return;

  if (!channelExist) {
    channelContainer.channels = new Collection();
    channelContainer.channels.set(channelId, new Collection());
  }
  return channelContainer.channels.get(channelId);
};
