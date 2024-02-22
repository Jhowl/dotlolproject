export const convertSecondsToTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = (seconds % 60).toFixed(0);
  return `${minutes}m ${secondsLeft}s`;
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit'
  };
  return date.toLocaleString('en-US', options);
};
