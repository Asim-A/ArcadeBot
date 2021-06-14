import { BannedName } from "../interfaces";

const BAN_LIST: string[] = ["h0nde", "h0nda", "qwe", "stake.com"];
const BAN_NAMES: BannedName[] = BAN_LIST.map(
  (name) => ({ name } as BannedName)
);

const BAN_GROUP_SIZE = 3;

export const getBannedGroupSize = (): number => {
  return BAN_GROUP_SIZE;
};

export const getBannedNames = (): BannedName[] => {
  return BAN_NAMES;
};

export const getBannedList = (): string[] => {
  return BAN_LIST;
};
