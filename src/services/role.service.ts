import { Guild } from "discord.js";
import { ProtectedRole } from "../interfaces";

export const ROLE_NAMES = {
  purge: "PurgeProtection",
  vcProt: "VC️ 🛡️",
};

const PROTECTED_ROLE_NAMES: ProtectedRole[] = [
  {
    data: {
      name: ROLE_NAMES.purge,
    },
    reason: "Role to protect against purge.",
  },
  {
    data: {
      name: ROLE_NAMES.vcProt,
    },
    reason:
      "Role that protect against being disconnected when you do not have camera on in a camera only voice chat.",
  },
];

export const serverRolesCheck = (guild: Guild) => {
  PROTECTED_ROLE_NAMES.forEach((pr) => {
    const hasRole =
      guild.roles.cache.find((r) => r.name == pr.data.name) != null;
    if (!hasRole) {
      const newRole = { data: pr.data, reason: pr.reason };
      guild.roles.create(newRole);
    }
  });
};
