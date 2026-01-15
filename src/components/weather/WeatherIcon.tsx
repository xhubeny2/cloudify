import { memo } from "react";

interface WeatherIconProps {
  code: string;
  description: string;
  size?: "sm" | "md" | "lg";
}

export const WeatherIcon = memo(function WeatherIcon({
  code,
  description,
  size = "md",
}: WeatherIconProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;

  return (
    <img
      src={iconUrl}
      alt={description}
      className={`weather-icon weather-icon--${size}`}
    />
  );
});
