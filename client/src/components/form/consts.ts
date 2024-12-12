import { TimeUnit } from "chart.js";

export type TimePeriodData = {
  label: string;
  hours: number;
  timeUnit: TimeUnit;
  stepSize: number;
};

export const timePeriodOptions: Record<string, TimePeriodData> = {
  "1h": { label: "Last Hour", hours: 1, timeUnit: "minute", stepSize: 10 },
  "3h": { label: "Last 3 Hours", hours: 3, timeUnit: "minute", stepSize: 30 },
  "12h": { label: "Last 12 Hours", hours: 12, timeUnit: "hour", stepSize: 1 },
  "1d": { label: "Last Day", hours: 24, timeUnit: "hour", stepSize: 1 },
  "3d": { label: "Last 3 Days", hours: 72, timeUnit: "hour", stepSize: 4 },
  "1w": { label: "Last Week", hours: 168, timeUnit: "day", stepSize: 1 },
};
