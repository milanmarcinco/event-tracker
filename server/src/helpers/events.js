exports.calculateRemainingDays = (event) => {
  const { day, month } = event;

  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  const nowTimestamp = nowDate.getTime();

  let eventYear;
  if (month - 1 > nowDate.getMonth() || (month - 1 == nowDate.getMonth() && day >= nowDate.getDate()))
    eventYear = nowDate.getFullYear();
  else eventYear = nowDate.getFullYear() + 1;

  const eventDate = new Date(eventYear, month - 1, day);
  const eventTimestamp = eventDate.getTime();

  const daysRemaining = Math.round((eventTimestamp - nowTimestamp) / (1000 * 60 * 60 * 24));

  return {
    ...event.toJSON(),
    daysRemaining,
    year: eventYear,
  };
};
