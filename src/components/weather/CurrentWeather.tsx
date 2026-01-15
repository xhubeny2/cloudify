import { memo } from "react";
import { WeatherIcon } from "./WeatherIcon";
import { Card, CardContent } from "../ui";
import "./style.scss";
import type { City, ForecastItem } from "@/store/types.ts";

interface CurrentWeatherProps {
  city: City;
  current: ForecastItem;
}

export const CurrentWeather = memo(function CurrentWeather({
  city,
  current,
}: CurrentWeatherProps) {
  const weather = current.weather[0];

  return (
    <Card>
      <CardContent className="current-weather">
        <div className="current-weather__location">
          <h2 className="current-weather__city">{city.name}</h2>
          {`, `}
          <p className="current-weather__country">{city.country}</p>
        </div>

        <div className="current-weather__main">
          <WeatherIcon
            code={weather.icon}
            description={weather.description}
            size="md"
          />
          <span className="current-weather__temp">
            {Math.round(current.main.temp)}°C
          </span>
        </div>

        <p className="current-weather__description">{weather.description}</p>

        <div className="current-weather__details">
          <div>
            <p className="current-weather__detail-label">Feels like</p>
            <p className="current-weather__detail-value">
              {Math.round(current.main.feels_like)}°C
            </p>
          </div>
          <div>
            <p className="current-weather__detail-label">Humidity</p>
            <p className="current-weather__detail-value">
              {current.main.humidity}%
            </p>
          </div>
          <div>
            <p className="current-weather__detail-label">Wind</p>
            <p className="current-weather__detail-value">
              {Math.round(current.wind.speed)} m/s
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
