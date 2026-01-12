import type { WeatherForecastResponse } from "../store/weather";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export interface FetchForecastParams {
  lat: number;
  lon: number;
  lang?: string;
  units?: "metric" | "imperial" | "standard";
}

export async function fetchForecast({
  lat,
  lon,
  lang = navigator.language.split("-")[0],
  units = "metric",
}: FetchForecastParams): Promise<WeatherForecastResponse> {
  const url = new URL(`${BASE_URL}/forecast`);
  url.searchParams.set("lat", lat.toString());
  url.searchParams.set("lon", lon.toString());
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `Weather API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
