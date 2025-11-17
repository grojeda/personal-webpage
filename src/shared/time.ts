import { CODING_START } from '../config/profile';

export const getUptimeString = (start = CODING_START) => {
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  const temp = new Date(start);
  temp.setFullYear(start.getFullYear() + years);
  if (temp > now) {
    years--;
    temp.setFullYear(start.getFullYear() + years);
  }

  let months = now.getMonth() - temp.getMonth();
  temp.setMonth(temp.getMonth() + months);
  if (temp > now) {
    months--;
    temp.setMonth(temp.getMonth() - 1);
  }

  const diffMs = now.getTime() - temp.getTime();
  const dayMs = 1000 * 60 * 60 * 24;
  const hourMs = 1000 * 60 * 60;
  const minuteMs = 1000 * 60;

  const days = Math.floor(diffMs / dayMs);
  let remainder = diffMs % dayMs;

  const hours = Math.floor(remainder / hourMs);
  remainder %= hourMs;

  const minutes = Math.floor(remainder / minuteMs);
  remainder %= minuteMs;

  const seconds = Math.floor(remainder / 1000);

  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${secondsStr}s`;
};
