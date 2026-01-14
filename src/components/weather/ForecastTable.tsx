import { useState, useMemo, useCallback } from "react";
import { ForecastRow, type DayForecast } from "./ForecastRow";
import { TemperatureChart } from "./TemperatureChart";
import { Card, CardContent, Dialog } from "../ui";
import type { ForecastItem } from "@/store/types";
import "./style.scss";

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
    const date = new Date(items[0].dt * 1000);
    const midday =
      items.find((i) => {
        const hour = new Date(i.dt * 1000).getHours();
        return hour >= 11 && hour <= 14;
      }) || items[Math.floor(items.length / 2)];

    days.push({
      date,
      label: date.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      icon: midday.weather[0].icon,
      description: midday.weather[0].description,
      precipitation: items.reduce((sum, i) => sum + (i.rain?.["3h"] || 0), 0),
      windSpeed: Math.round(
        items.reduce((sum, i) => sum + i.wind.speed, 0) / items.length
      ),
      items,
    });
  }

  return days;
}

export function ForecastTable({ list }: ForecastTableProps) {
  const days = useMemo(() => groupByDay(list), [list]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleRowClick = useCallback((index: number) => {
    setSelectedDay(index);
  }, []);

  const closeDialog = useCallback(() => {
    setSelectedDay(null);
  }, []);

  return (
    <>
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
            {days.map((day, index) => (
              <ForecastRow
                key={day.date.toISOString()}
                day={day}
                index={index}
                onSelect={handleRowClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        isOpen={selectedDay !== null}
        onClose={closeDialog}
        title={selectedDay !== null ? days[selectedDay].label : ""}
      >
        {selectedDay !== null && (
          <TemperatureChart items={days[selectedDay].items} />
        )}
      </Dialog>
    </>
  );
}
