import {
  Client,
  Collection,
  Guild,
  GuildMember,
  Message,
  User,
} from "discord.js";

export interface RunEvent {
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
