import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeUnit,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

import styles from "./CPUUsageChart.module.css";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type CPUUsagePoint = {
  date: Date;
  cpu: number;
};

type CPUUsageChartProps = {
  points: CPUUsagePoint[];
  stepSize: number;
  timeUnit: TimeUnit;
};

function CPUUsageChart({ points, stepSize, timeUnit }: CPUUsageChartProps) {
  const labels = points.map((point) => point.date);
  const values = points.map((point) => point.cpu);

  const datasets = [
    {
      label: "CPU Usage",
      data: values,
      borderColor: "red",
      tension: 0.3,
    },
  ];

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time" as const,
        time: { unit: timeUnit },
        ticks: {
          stepSize,
        },
      },
      y: {
        title: {
          display: true,
          text: "CPU Usage (%)",
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <Line options={options} data={data} />
    </div>
  );
}

export default CPUUsageChart;
