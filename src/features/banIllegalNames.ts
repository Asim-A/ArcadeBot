import { GuildMember } from "discord.js";
import { CachedMember, UserGuildMemberTuple } from "../interfaces";
import { getBannedList } from "../services/banned.service";
import { dateDiffInDays } from "../util/date";

const BAN_LIST = getBannedList();

const shouldMemberBeBanned = (guildMember: GuildMember): boolean => {
  let { displayName, nickname } = guildMember;
  displayName = displayName.toLocaleLowerCase();
  if (nickname != null) {
    nickname = nickname?.toLocaleLowerCase();
  } else {
    nickname = "";
  }

  for (let banned_names of BAN_LIST) {
    if (displayName == banned_names) {
      return true;
    } else if (nickname == banned_names) {
      return true;
    }
  }
  return false;
};

const fromMember = (member: UserGuildMemberTuple): CachedMember => {
  const userId = member[0];
  const guildMember = member[1];

  return {
    userId,
    guildMember,
  };
};

export const banIllegalNames = (member: UserGuildMemberTuple): CachedMember => {
  const cachedMember = fromMember(member);
  const { guildMember } = cachedMember;
  const user = guildMember.user;

  const todaysDate = new Date();
  const usersDate = new Date(user.createdAt);
  const diffDay = dateDiffInDays(usersDate, todaysDate);

  const shouldBeBanned = shouldMemberBeBanned(guildMember);

  if (shouldBeBanned && diffDay < 30) {
    guildMember.ban({ days: 7 });
  }

  return cachedMember;
};
