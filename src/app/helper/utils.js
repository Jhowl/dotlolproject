export const convertSecondsToTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = (seconds % 60).toFixed(0);
  return `${minutes}m ${secondsLeft}s`;
};
