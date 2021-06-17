import {
  Client,
  Collection,
  Guild,
  GuildMember,
  Message,
  RoleData,
  User,
} from "discord.js";

export interface RunEvent {
  command: string;
  message: Message;
  client: Client;
  args: string[];
}
export interface Argument {
  command: string;
  data: string;
}

export interface CachedMember {
  userId: string;
  guildMember: GuildMember;
}

export interface BannedName {
  name: string;
}

export type UserGuildMemberTuple = [string, GuildMember];

export interface BanGroup {
  owner: User;
  guild: Guild | null;
  group: Map<number, Array<CachedMember>> | null;
}

export interface ChannelContainer {
  channels: Collection<string, Collection<string, CameraVoiceChannelUser>>;
}

export interface CameraVoiceChannelUser {
  timeWithCameraOff: Date;
  user: GuildMember;
}

export interface ProtectedRole {
  data: RoleData;
  reason: string;
}
