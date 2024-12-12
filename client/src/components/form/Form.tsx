import { FormEvent } from "react";

import styles from "./Form.module.css";
import { TimePeriodData, timePeriodOptions } from "./consts";

const isValidIP = (ip: string) => {
  const ipRegExp = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
  return ipRegExp.test(ip);
};

const isValidInterval = (interval: number) =>
  interval > 0 && interval % 60 == 0;

type FormProps = {
  onSubmit: (
    ip: string,
    interval: number,
    timePeriodData: TimePeriodData
  ) => void;
};

function Form({ onSubmit }: FormProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const ip = formData.get("ip") as string;
    const interval = parseInt(formData.get("interval") as string);
    const key = formData.get("period") as keyof typeof timePeriodOptions;

    if (!isValidIP(ip)) {
      alert("Invalid IP address. Please enter a valid IPv4 address.");
      return;
    }

    if (isNaN(interval) || !isValidInterval(interval)) {
      alert(
        "Invalid period. It must be a positive number and a multiple of 60."
      );
      return;
    }

    onSubmit(ip, interval, timePeriodOptions[key]);
  };

  return (
    <div className={styles.container}>
      <h2>AWS Instance CPU Usage</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="time-period">Time period:</label>
          <select id="time-period" name="period" required>
            {Object.keys(timePeriodOptions).map((key) => (
              <option value={key} key={key}>
                {timePeriodOptions[key].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="period">Period (seconds):</label>
          <input id="period" name="interval" required />
        </div>

        <div>
          <label htmlFor="ip">IP address:</label>
          <input id="ip" name="ip" required />
          <button>Load</button>
        </div>
      </form>
    </div>
  );
}

export default Form;
