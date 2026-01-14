import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchWeatherRequest } from "@/store/weather";
import { useGeolocation } from "@/hooks";
import { CurrentWeather } from "./CurrentWeather";
import { ForecastTable } from "./ForecastTable";
import { Button, LoaderOverlay, ErrorMessage } from "../ui";
import "./style.scss";

export function WeatherContainer() {
  const dispatch = useAppDispatch();
  const { forecast, loading, error } = useAppSelector((state) => state.weather);
  const { coordinates, loading: geoLoading } = useGeolocation();

  useEffect(() => {
    if (coordinates) {
      dispatch(fetchWeatherRequest(coordinates));
    }
  }, [coordinates, dispatch]);

  const handleRefresh = () => {
    if (forecast?.city) {
      dispatch(fetchWeatherRequest(forecast.city.coord));
      return;
    }
    if (coordinates) {
      dispatch(fetchWeatherRequest(coordinates));
    }
  };

  if (geoLoading || loading) {
    return <LoaderOverlay message="Getting the best weather..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  if (!forecast) {
    return (
      <div className="weather-container__empty">
        <p className="weather-container__empty-text">
          Unable to retrieve weather data
        </p>
        <Button onClick={handleRefresh}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="weather-container">
      <CurrentWeather city={forecast.city} current={forecast.list[0]} />
      <ForecastTable list={forecast.list} />

      <div className="weather-container__actions">
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          Update
        </Button>
      </div>
    </div>
  );
}
