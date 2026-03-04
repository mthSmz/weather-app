import cityConfig from "../../config/city.json";

const getWeatherCodeMeta = (weatherCode, isDay) => {
  const dayOrNight = isDay ? "d" : "n";

  const weatherCodeMap = {
    0: { description: "clear sky", iconPrefix: "01" },
    1: { description: "mainly clear", iconPrefix: "02" },
    2: { description: "partly cloudy", iconPrefix: "03" },
    3: { description: "overcast", iconPrefix: "04" },
    45: { description: "fog", iconPrefix: "50" },
    48: { description: "depositing rime fog", iconPrefix: "50" },
    51: { description: "light drizzle", iconPrefix: "09" },
    53: { description: "moderate drizzle", iconPrefix: "09" },
    55: { description: "dense drizzle", iconPrefix: "09" },
    56: { description: "light freezing drizzle", iconPrefix: "09" },
    57: { description: "dense freezing drizzle", iconPrefix: "09" },
    61: { description: "slight rain", iconPrefix: "10" },
    63: { description: "moderate rain", iconPrefix: "10" },
    65: { description: "heavy rain", iconPrefix: "10" },
    66: { description: "light freezing rain", iconPrefix: "13" },
    67: { description: "heavy freezing rain", iconPrefix: "13" },
    71: { description: "slight snow fall", iconPrefix: "13" },
    73: { description: "moderate snow fall", iconPrefix: "13" },
    75: { description: "heavy snow fall", iconPrefix: "13" },
    77: { description: "snow grains", iconPrefix: "13" },
    80: { description: "slight rain showers", iconPrefix: "09" },
    81: { description: "moderate rain showers", iconPrefix: "09" },
    82: { description: "violent rain showers", iconPrefix: "09" },
    85: { description: "slight snow showers", iconPrefix: "13" },
    86: { description: "heavy snow showers", iconPrefix: "13" },
    95: { description: "thunderstorm", iconPrefix: "11" },
    96: { description: "thunderstorm with hail", iconPrefix: "11" },
    99: { description: "thunderstorm with heavy hail", iconPrefix: "11" },
  };

  const weatherMeta =
    weatherCodeMap[weatherCode] || {
      description: "unknown",
      iconPrefix: "01",
    };

  return {
    description: weatherMeta.description,
    icon: `${weatherMeta.iconPrefix}${dayOrNight}`,
  };
};

export default async function handler(_req, res) {
  try {
    const configuredCity = cityConfig.city;

    if (!configuredCity) {
      return res.status(500).json({ message: "Configured city is missing" });
    }

    const geocodingRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        configuredCity
      )}&count=1&language=en&format=json`
    );

    const geocodingData = await geocodingRes.json();
    const city = geocodingData?.results?.[0];

    if (!city) {
      return res.status(404).json({ message: "City not found, try again!" });
    }

    const forecastRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m&hourly=visibility&daily=sunrise,sunset&timezone=auto&wind_speed_unit=ms&timeformat=unixtime`
    );

    const forecastData = await forecastRes.json();

    if (!forecastData?.current || !forecastData?.daily) {
      return res.status(502).json({ message: "Weather provider error" });
    }

    const current = forecastData.current;
    const weatherMeta = getWeatherCodeMeta(current.weather_code, current.is_day === 1);

    const visibilityIndex = forecastData?.hourly?.time?.indexOf(current.time);
    const visibilityFromHourly =
      visibilityIndex >= 0
        ? forecastData?.hourly?.visibility?.[visibilityIndex]
        : undefined;

    return res.status(200).json({
      name: city.name,
      sys: {
        country: city.country_code || "",
        sunrise: forecastData.daily.sunrise[0],
        sunset: forecastData.daily.sunset[0],
      },
      weather: [
        {
          description: weatherMeta.description,
          icon: weatherMeta.icon,
        },
      ],
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
      },
      wind: {
        speed: current.wind_speed_10m,
        deg: current.wind_direction_10m,
      },
      visibility: visibilityFromHourly ?? 10000,
      dt: current.time,
      timezone: forecastData.utc_offset_seconds,
    });
  } catch (error) {
    return res.status(500).json({ message: "Weather service unavailable" });
  }
}
