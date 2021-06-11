import { BannedName } from "../interfaces";

const BAN_LIST: string[] = ["h0nde", "h0nda"];
const BAN_NAMES: BannedName[] = BAN_LIST.map(
  (name) => ({ name } as BannedName)
);

export const getBannedNames = (): BannedName[] => {
  return BAN_NAMES;
};

export const getBannedList = (): string[] => {
  return BAN_LIST;
};
