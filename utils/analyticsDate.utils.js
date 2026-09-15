export const getWindowEnd = (startDate, period) => {
  const end = new Date(startDate);

  switch (period) {
    case "hourly":
      end.setHours(end.getHours() + 3);
      break;

    case "daily":
      end.setDate(end.getDate() + 3);
      break;

    case "weekly":
      end.setDate(end.getDate() + 21);
      break;

    case "monthly":
      end.setMonth(end.getMonth() + 3);
      break;

    default:
      throw new Error("Invalid analytics period");
  }

  return end;
};

// Moves the analytics time window by the specified period and direction
export const moveWindow = (startDate, period, direction) => {
  const newStart = new Date(startDate);

  const multiplier = direction === "next" ? 1 : -1;

  switch (period) {
    case "hourly":
      newStart.setHours(newStart.getHours() + 3 * multiplier);
      break;

    case "daily":
      newStart.setDate(newStart.getDate() + 3 * multiplier);
      break;

    case "weekly":
      newStart.setDate(newStart.getDate() + 21 * multiplier);
      break;

    case "monthly":
      newStart.setMonth(newStart.getMonth() + 3 * multiplier);
      break;

    default:
      throw new Error("Invalid analytics period");
  }

  return newStart;
};

// Formats a Date object into a string in the format "YYYY-MM-DDTHH:mm:ss"
export const formatDateTime = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  return date.toISOString();
};

// Returns a human-readable label for the analytics time window based on the period
export const getWindowSizeLabel = (period) => {
  switch (period) {
    case "hourly":
      return "3 Hours";

    case "daily":
      return "3 Days";

    case "weekly":
      return "3 Weeks";

    case "monthly":
      return "3 Months";

    default:
      return "";
  }
};

// Returns the initial start date for the analytics time window based on the period
export const getInitialWindowStart = (period) => {
  const now = new Date();

  if (period === "hourly") {
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    now.setHours(now.getHours() - 2);
  }

  if (period === "daily") {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    now.setDate(now.getDate() - 2);
  }

  if (period === "weekly") {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    now.setDate(now.getDate() - 20);
  }

  if (period === "monthly") {
    return new Date(now.getFullYear(), now.getMonth() - 2, 1);
  }

  return now;
};
