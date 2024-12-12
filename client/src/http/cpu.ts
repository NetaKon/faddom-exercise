import { CPUUsagePoint } from "../components/cpuUsageChart/CPUUsageChart";

// const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
const BASE_URL = "http://localhost:5000/get-cpu-usage";

export async function fetchCPUUsage(
  ip: string,
  period: number,
  interval: number
): Promise<CPUUsagePoint[]> {
  const params = new URLSearchParams({
    ip: ip,
    period: period.toString(),
    interval: interval.toString(),
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  const points = data.Datapoints.map((point: any) => {
    return { date: new Date(point.Timestamp), cpu: point.Average };
  });

  return points;
}
