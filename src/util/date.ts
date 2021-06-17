const _MS_PER_DAY = 1000 * 60 * 60 * 24;
const _MS_SECOND = 1000;

/**
 *
 */
export const dateDiffInDays = (
  earlierPointInTime: Date,
  laterPointInTime: Date
): number => {
  const utc1 = Date.UTC(
    earlierPointInTime.getFullYear(),
    earlierPointInTime.getMonth(),
    earlierPointInTime.getDate()
  );
  const utc2 = Date.UTC(
    laterPointInTime.getFullYear(),
    laterPointInTime.getMonth(),
    laterPointInTime.getDate()
  );

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const dateDiffInDaysUntilToday = (earlierPointInTime: Date): number => {
  const todaysDate = new Date();
  return dateDiffInDays(earlierPointInTime, todaysDate);
};

export const dateDiffInSeconds = (startTime: Date) => {
  const now = new Date();
  const seconds = (now.getTime() - startTime.getTime()) / _MS_SECOND;
  return seconds;
};
