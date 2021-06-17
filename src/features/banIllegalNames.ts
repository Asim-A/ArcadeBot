import { Collection, GuildMember, Message } from "discord.js";
import { ROLE_NAMES } from "../services/role.service";
import { BanGroup, CachedMember, UserGuildMemberTuple } from "../interfaces";
import { getBannedGroupSize, getBannedList } from "../services/banned.service";
import { dateDiffInDaysUntilToday } from "../util/date";

const BAN_LIST = getBannedList();
const MINIMUM_DISCORD_ACCOUNT_OLD_DAYS = 30;
const GROUP_SIZE = getBannedGroupSize();

const memberHasProtection = (member: GuildMember): boolean => {
  const memberRoles = member.roles.cache;
  let isProtected = false;
  memberRoles.forEach((role) => {
    if (role.name === ROLE_NAMES.purge) {
      isProtected = true;
    }
  });

  return isProtected;
};

const shouldMemberBeBanned = (guildMember: GuildMember): boolean => {
  // if (guildMember.guild.id === "315008534582657024") return true;

  if (memberHasProtection(guildMember)) {
    return false;
  }

  let { displayName, nickname } = guildMember;
  const username = guildMember.user.username;

  displayName = displayName.toLocaleLowerCase();
  if (nickname != null) {
    nickname = nickname?.toLocaleLowerCase();
  } else {
    nickname = "";
  }

  for (let banned_name of BAN_LIST) {
    const displayNameContainsBanName: boolean =
      displayName.includes(banned_name);

    const nicknameContainsBanName: boolean =
      nickname.length != 0 && nickname.includes(banned_name);

    const userNameContainsBanName: boolean = username.includes(banned_name);

    if (
      displayNameContainsBanName ||
      nicknameContainsBanName ||
      userNameContainsBanName
    ) {
      if (guildMember.guild.id === "315008534582657024") return true;

      const usersDate = new Date(guildMember.user.createdAt);
      const diffDay = dateDiffInDaysUntilToday(usersDate);
      const accountIsTooNew = diffDay < MINIMUM_DISCORD_ACCOUNT_OLD_DAYS;

      if (accountIsTooNew) {
        return true;
      }
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

export const banIllegalNames = (
  member: UserGuildMemberTuple
): CachedMember | null => {
  const cachedMember = fromMember(member);
  const { guildMember } = cachedMember;

  const shouldBeBanned = shouldMemberBeBanned(guildMember);

  if (shouldBeBanned) {
    guildMember.ban({ days: 7 });
    return cachedMember;
  }

  return null;
};

export const findMembersWithIllegalNames = (
  members: Collection<string, GuildMember>
): CachedMember[] => {
  const possibleBans: CachedMember[] = [];

  for (let member of members) {
    const cachedMember = fromMember(member);
    const { guildMember } = cachedMember;
    const shouldBeBanned = shouldMemberBeBanned(guildMember);

    if (shouldBeBanned) {
      possibleBans.push(cachedMember);
    }
  }

  return possibleBans;
};

export const groupMembersThatShouldBeBanned = (
  message: Message,
  guildMembersUpForBan: CachedMember[]
): BanGroup => {
  const { author, guild } = message;
  const banGroup: BanGroup = { owner: author, guild: guild, group: null };
  const listSize = guildMembersUpForBan.length;
  let groupNumber = 0;

  const group: Map<number, Array<CachedMember>> = new Map();
  for (let i = 0; i < listSize; i += GROUP_SIZE) {
    const groupMembers: CachedMember[] = [];

    for (let j = 0; j < GROUP_SIZE; j++) {
      const offset = i + j;
      if (offset > listSize) {
        break;
      }

      const groupMember = guildMembersUpForBan[offset];
      groupMembers.push(groupMember);
    }
    group.set(groupNumber, groupMembers);
    groupNumber++;
  }

  banGroup.group = group;

  return banGroup;
};

/**
 * Go through GROUP_SIZE amount of members, keep adding until
 * i % GROUP_SIZE == 0, lag ny array
 *
 */
