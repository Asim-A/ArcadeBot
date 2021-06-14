export const matchName = (name: string, match: string) => {
  if (name == null) {
    return false;
  }
  const lName = name.toLocaleLowerCase();
  return lName.includes(match);
};

export const splitAtFirstSpace = (str: string) => {
  if (!str) return [];
  var i = str.indexOf(" ");
  if (i > 0) {
    return [str.substring(0, i), str.substring(i + 1)];
  } else return [str];
};
