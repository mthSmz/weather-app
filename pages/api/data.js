// OPEN WEATHER API :

// export default async function handler(req, res) {
//   const { cityInput } = req.body;
//   const getWeatherData = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
//   );
//   const data = await getWeatherData.json();
//   res.status(200).json(data);
// }

// -------------------

// OPEN METEO API :

export default async function handler(req, res) {
  const { cityInput } = req.body;

  // fetching city coordonates via Open Meteo Geocoding API
  const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=1`);
  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    return res.status(404).json({ error: "City not found." })
  }

  const {latitude, longitude, timezone } = geoData.result[0];

  // calling Open Meteo API

  const weatherResponse = await fetch( `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m&daily=sunrise&timezone=${timezone}` );
  const weatherData = await weatherResponse.json();

  // location and weather datas
  const openMeteoData = {
    location: {
      city: geoData.result[0].name,
      country: geoData.result[0].country,
      latitude,
      longitude,
      timezone,
    },
    weather: weatherData
  };

  return res.status(200).json(openMeteoData);
}
