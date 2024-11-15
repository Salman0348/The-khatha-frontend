/**
 *
 * @param {time} utcDateString
 * @returns local formated date time
 */
function formatToLocalTime(utcDateString) {
  const date = new Date(utcDateString);

  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat(undefined, options);
  return formatter.format(date);
}

export default formatToLocalTime;
