export default async function handler(req, res) {
  const { cityInput } = req.body;
  const getWeatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/group?id=2988507,2995469,2998324&appid=19ffbf68fe353eb7b7a47d9ced76daa9`,
  );
  const data = await getWeatherData.json();
  res.status(200).json(data);
}
