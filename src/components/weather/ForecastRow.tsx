import { memo, useCallback } from "react";
import { WeatherIcon } from "./WeatherIcon";
import type { ForecastItem } from "@/store/types";

export interface DayForecast {
  date: Date;
  label: string;
  tempMin: number;
  tempMax: number;
  icon: string;
  description: string;
  precipitation: number;
  windSpeed: number;
  items: ForecastItem[];
}

interface ForecastRowProps {
  day: DayForecast;
  index: number;
  onSelect: (index: number) => void;
}

export const ForecastRow = memo(function ForecastRow({
  day,
  index,
  onSelect,
}: ForecastRowProps) {
  const handleClick = useCallback(() => onSelect(index), [index, onSelect]);

  return (
    <div
      className="forecast-grid__row forecast-grid__row--clickable"
      onClick={handleClick}
    >
      <div className="forecast-grid__day">{day.label}</div>
      <div className="forecast-grid__icon">
        <WeatherIcon code={day.icon} description={day.description} size="sm" />
      </div>
      <div className="forecast-grid__temp">
        <span className="forecast-grid__temp-max">{day.tempMax}°</span>
        <span className="forecast-grid__temp-min">{day.tempMin}°</span>
      </div>
      <div className="forecast-grid__precip">
        {day.precipitation > 0 ? `${day.precipitation.toFixed(1)} mm` : "-"}
      </div>
      <div className="forecast-grid__wind">{day.windSpeed} m/s</div>
    </div>
  );
});