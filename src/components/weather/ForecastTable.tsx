import { useMemo } from "react";
import { WeatherIcon } from "./WeatherIcon";
import { Card, CardContent } from "../ui";
import type { ForecastItem } from "@/store/types";
import "./style.scss";

interface DayForecast {
  date: Date;
  tempMin: number;
  tempMax: number;
  icon: string;
  description: string;
  precipitation: number;
  windSpeed: number;
}

interface ForecastTableProps {
  list: ForecastItem[];
}

function groupByDay(list: ForecastItem[]): DayForecast[] {
  const grouped = new Map<string, ForecastItem[]>();

  for (const item of list) {
    const date = new Date(item.dt * 1000);
    const key = date.toDateString();

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  }
  const days: DayForecast[] = [];

  for (const [, items] of grouped) {
    const temps = items.map((i) => i.main.temp);
    const midday =
      items.find((i) => {
        const hour = new Date(i.dt * 1000).getHours();
        return hour >= 11 && hour <= 14;
      }) || items[Math.floor(items.length / 2)];

    days.push({
      date: new Date(items[0].dt * 1000),
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      icon: midday.weather[0].icon,
      description: midday.weather[0].description,
      precipitation: items.reduce((sum, i) => sum + (i.rain?.["3h"] || 0), 0),
      windSpeed: Math.round(
        items.reduce((sum, i) => sum + i.wind.speed, 0) / items.length,
      ),
    });
  }

  return days;
}

function formatDay(date: Date): string {
  return date.toLocaleDateString("en-EN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function ForecastTable({ list }: ForecastTableProps) {
  const days = useMemo(() => groupByDay(list), [list]);

  return (
    <Card>
      <CardContent>
        <div className="forecast-grid">
          <div className="forecast-grid__header">
            <div></div>
            <div></div>
            <div className="forecast-grid__header-item">Temp</div>
            <div className="forecast-grid__header-item">Rain</div>
            <div className="forecast-grid__header-item">Wind</div>
          </div>
          {days.map((day) => (
            <div key={day.date.toISOString()} className="forecast-grid__row">
              <div className="forecast-grid__day">{formatDay(day.date)}</div>
              <div className="forecast-grid__icon">
                <WeatherIcon
                  code={day.icon}
                  description={day.description}
                  size="sm"
                />
              </div>
              <div className="forecast-grid__temp">
                <span className="forecast-grid__temp-max">{day.tempMax}°</span>
                <span className="forecast-grid__temp-min">{day.tempMin}°</span>
              </div>
              <div className="forecast-grid__precip">
                {day.precipitation > 0
                  ? `${day.precipitation.toFixed(1)} mm`
                  : "-"}
              </div>
              <div className="forecast-grid__wind">{day.windSpeed} m/s</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
