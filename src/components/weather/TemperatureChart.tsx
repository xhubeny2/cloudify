import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { ForecastItem } from "@/store/types";

interface TemperatureChartProps {
  items: ForecastItem[];
}

export function TemperatureChart({ items }: TemperatureChartProps) {
  const chartData = useMemo(
    () =>
      items.map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: Math.round(item.main.temp),
      })),
    [items],
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          domain={["dataMin - 2", "dataMax + 2"]}
          tickFormatter={(value: string) => `${value}°`}
        />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="#646cff"
          strokeWidth={2}
          dot={{ fill: "#646cff", r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
