const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  // Remove time and compare dates only
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffInDays = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));

  // Today → time
  if (diffInDays === 0) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Yesterday
  if (diffInDays === 1) {
    return "Yesterday";
  }

  // Within the last 7 days → day name
  if (diffInDays < 7) {
    return date.toLocaleDateString([], {
      weekday: "long",
    });
  }

  // Older → date
  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default formatMessageTime;
