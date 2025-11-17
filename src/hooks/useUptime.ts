// src/hooks/useUptime.ts
import { useEffect, useState } from 'react';
import { getUptimeString } from '../shared/time';

export const useUptime = () => {
  const [uptime, setUptime] = useState(() => getUptimeString());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setUptime(getUptimeString());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return uptime;
};
