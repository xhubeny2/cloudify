// OpenWeatherMap API response types

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  "3h": number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface City {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ReducedCity {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
}

export interface WeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: City;
}

export interface WeatherState {
  forecast: WeatherForecastResponse | null;
  loading: boolean;
  error: string | null;
}

export interface CitiesState {
  results: ReducedCity[] | null;
  isInitializing: boolean;
  isSearching: boolean;
  error: string | null;
}

export interface FetchWeatherPayload {
  lat: number;
  lon: number;
}

// Worker messages sent TO the worker
export type WorkerInputMessage =
  | { type: "INIT_DATA"; payload: ReducedCity[] }
  | { type: "SEARCH_QUERY"; payload: string };

// Worker messages sent FROM the worker
export type WorkerOutputMessage =
  | { type: "READY" }
  | { type: "SEARCH_RESULTS"; payload: ReducedCity[] };
