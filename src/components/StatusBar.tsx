import { useEffect, useMemo, useState } from 'react';

type Telemetry = {
  cpu: number;
  memoryUsed: number;
  temperature: number;
  networkStrength: number;
  bluetoothConnected: boolean;
};

const randomInRange = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

const generateTelemetry = (): Telemetry => ({
  cpu: randomInRange(15, 55),
  memoryUsed: randomInRange(6, 14),
  temperature: randomInRange(33, 58),
  networkStrength: randomInRange(2, 5),
  bluetoothConnected: Math.random() > 0.25
});

const wifiIcon = '󰤨';
const cpuIcon = '󰘚';
const tempIcon = '';
const ramIcon = '';
const volumeIcon = '';
const batteryIcon = '';
const bluetoothIcon = '';

const StatusBar = () => {
  const [now, setNow] = useState(() => new Date());
  const [telemetry, setTelemetry] = useState<Telemetry>(() => generateTelemetry());

  useEffect(() => {
    const clockInterval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const telemetryInterval = setInterval(() => setTelemetry(generateTelemetry()), 5500);
    return () => clearInterval(telemetryInterval);
  }, []);

  const clockValue = useMemo(() => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(now);
  }, [now]);

  const COMMON_HEIGHT = 'h-8 leading-none';

  const shellSurface =
    'bg-[rgba(36,39,58,0.78)] shadow-[0_2px_12px_rgba(0,0,0,0.35)]';

  const shellBase =
    `pointer-events-auto inline-flex items-center rounded-md px-4 py-1 text-[13px] text-[#cdd6f4] ${COMMON_HEIGHT}`;

  const telemetryPillBase =
    `inline-flex items-center rounded-md bg-[rgba(36,39,58,0.78)] px-3 text-[13px] text-[#cdd6f4] shadow-[0_2px_12px_rgba(0,0,0,0.35)] whitespace-nowrap ${COMMON_HEIGHT}`;

  const telemetryPill = `${telemetryPillBase} justify-between`;
  const telemetryPillIconOnly = `${telemetryPillBase} justify-center w-8`;

  const workspaceButtonClass =
    'px-2 py-1 text-[13px] uppercase tracking-[0.2em] transition-colors duration-200 border-b-2 border-transparent';

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-40 px-6 pt-3 text-[#cdd6f4]">
      <div className="relative mx-auto flex items-center justify-between font-mono">
        {/* IZQUIERDA: reloj */}
        <div className={`${shellBase} ${shellSurface}`}>
          <span className="tracking-[0.3em]">{clockValue}</span>
        </div>

        {/* CENTRO: workspaces */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className={`${shellBase} ${shellSurface} justify-center gap-1`}>
            {[1, 2, 3, 4, 5].map((label) => (
              <span
                key={label}
                className={`${workspaceButtonClass}  ${
                  label === 1
                    ? 'text-[#a6e3a1]'
                    : 'text-[#7f849c]'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* DERECHA: métricas */}
        <div className="flex items-center gap-2 ml-auto">
          <div className={`${telemetryPill} w-20`}>
            <span className="text-sm">{cpuIcon}</span>
            <span>{telemetry.cpu}%</span>
          </div>
          <div className={`${telemetryPill} w-20`}>
            <span className="text-sm">{tempIcon}</span>
            <span>{telemetry.temperature}°C</span>
          </div>
          <div className={`${telemetryPill} w-20`}>
            <span className="text-sm">{ramIcon}</span>
            <span>{telemetry.memoryUsed.toFixed(1)}G</span>
          </div>
          <div className={`${telemetryPill} w-[72px]`}>
            <span className="text-sm">{volumeIcon}</span>
            <span>42%</span>
          </div>
          <div className={telemetryPillIconOnly}>
            <span className="text-sm">{batteryIcon}</span>
          </div>
          <div className={telemetryPillIconOnly}>
            <span className="text-sm">{bluetoothIcon}</span>
          </div>
          <div className={telemetryPillIconOnly}>
            <span className="text-sm">{wifiIcon}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StatusBar;
