import { Client, GuildMember, Message } from "discord.js";

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
