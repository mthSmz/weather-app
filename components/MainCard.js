import Image from "next/image";
import { ctoF } from "../services/converters";
import styles from "./MainCard.module.css";

export const MainCard = ({
  city,
  country,
  description,
  iconName,
  unitSystem,
  //weatherData,
  currentTemperature,
}) => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.location}>
        {city}, {country}
      </h1>
      <p className={styles.description}>{description}</p>
      <Image
        width="300px"
        height="300px"
        src={`/icons/${iconName}.svg`}
        alt="weatherIcon"
      />
      <h1 className={styles.currentTemperature}>
        {unitSystem === "metric"
          ? Math.round(currentTemperature.temp.min)
          : Math.round(ctoF(currentTemperature.temp.max))}
        °{unitSystem === "metric" ? "C" : "F"}
      </h1>
      <p>
        Feels like{" "}
        {unitSystem === "metric"
          ? Math.round(currentTemperature.main.feels_like.day)
          : Math.round(ctoF(currentTemperature.main.feels_like.night))}
        °{unitSystem === "metric" ? "C" : "F"}
      </p>
    </div>
  );
};
