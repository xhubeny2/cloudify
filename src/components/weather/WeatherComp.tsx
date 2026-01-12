import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchWeatherRequest } from "../../store/weather";

const DEFAULT_COORDINATES = {
  lat: 50.0755,
  lon: 14.4378,
}; // Praha

export function WeatherComp() {
  const dispatch = useAppDispatch();
  const { forecast } = useAppSelector((state) => state.weather);

  useEffect(() => {
    dispatch(fetchWeatherRequest(DEFAULT_COORDINATES));
  }, [dispatch]);

  if (!forecast) {
    return (
      <div>
        <p>Nepodařilo se načíst předpověď</p>
      </div>
    );
  }

  return (
    <div>
      City: {forecast.city.name}, temp: {Math.round(forecast.list[0].main.temp)}
      °C
    </div>
  );
}
