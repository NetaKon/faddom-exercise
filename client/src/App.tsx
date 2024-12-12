import { useState } from "react";

import Form from "./components/form/Form";
import CPUUsageChart, {
  CPUUsagePoint,
} from "./components/cpuUsageChart/CPUUsageChart";
import { fetchCPUUsage } from "./http/cpu";

import "./App.css";
import { TimeUnit } from "chart.js";
import { TimePeriodData } from "./components/form/consts";

function App() {
  const [data, setData] = useState<CPUUsagePoint[] | null>(null);
  const [stepSize, setStepSize] = useState<number>(10);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("minute");

  async function fetchDatapoints(
    ip: string,
    interval: number,
    timePeriodData: TimePeriodData
  ) {
    const { hours, stepSize, timeUnit } = timePeriodData;
    try {
      const points = await fetchCPUUsage(ip, hours, interval);
      setData(points);
      setStepSize(stepSize);
      setTimeUnit(timeUnit);
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <div className="App">
      <Form onSubmit={fetchDatapoints} />
      {data && (
        <CPUUsageChart points={data} stepSize={stepSize} timeUnit={timeUnit} />
      )}
    </div>
  );
}

export default App;
