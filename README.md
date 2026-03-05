# Weather App

A simple weather dashboard built with Next.js.

It displays current weather conditions for a **pre-configured city** and lets users switch between **metric** and **imperial** units.

## Features

1. Weather data powered by **Open-Meteo** (geocoding + forecast)
2. Pre-configured location from `config/city.json` (no city search in UI)
3. Current local date and time
4. Temperature + "feels like" temperature
5. Humidity, wind speed, wind direction
6. Visibility, sunrise and sunset
7. Metric / Imperial unit switch
9. Automatic data refresh every hour

## Tech notes

- Data is fetched through the internal API route: `pages/api/data.js`
- API response is normalized to keep UI components stable
- Weather codes from Open-Meteo are mapped to local icons (`public/icons`)

## Configuration
  
- Set the city used by the app in:
  `config/city.json`

## Installation

1. `git clone https://github.com/mthSmz/weather-app.git`
2. `cd weather-app`
3. `npm install`
4. `npm run dev`

Then open `http://localhost:3000`.

## License

This project is released under the [MIT license](https://choosealicense.com/licenses/mit/).
