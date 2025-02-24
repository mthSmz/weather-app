import { getWeekDay, getTime, getAMPM } from "../services/helpers";
import styles from "./DateAndTime.module.css";

export const DateAndTime = ({ currentTemperature, unitSystem }) => {
  return (
    <div className={styles.wrapper}>
      <h2>
        {`${getWeekDay(currentTemperature)}, ${getTime(
          unitSystem,
          currentTemperature.dt,
          currentTemperature.timezone
        )} ${getAMPM(unitSystem, currentTemperature.dt, currentTemperature.timezone)}`}
      </h2>
    </div>
  );
};
