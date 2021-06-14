const _MS_PER_DAY = 1000 * 60 * 60 * 24;

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
