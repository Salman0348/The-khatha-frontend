function formatToPakistaniTime(utcDateString) {
  const date = new Date(utcDateString);

  const options = {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(date);

  const day = parts.find((p) => p.type === "day").value;
  const month = parts.find((p) => p.type === "month").value;
  const year = parts.find((p) => p.type === "year").value;
  const hour = parts.find((p) => p.type === "hour").value;
  const minute = parts.find((p) => p.type === "minute").value;
  const dayPeriod = parts.find((p) => p.type === "dayPeriod").value;

  return `${day}/${month}/${year} ${hour}:${minute} ${dayPeriod}`;
}

export default formatToPakistaniTime;
