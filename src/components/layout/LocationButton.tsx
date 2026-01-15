import { useCallback } from "react";
import { useAppDispatch } from "@/store";
import { fetchWeatherRequest } from "@/store/weather";
import { useGeolocation } from "@/hooks";

export function LocationButton() {
  const dispatch = useAppDispatch();
  const { refresh, loading } = useGeolocation();

  const handleLocationClick = useCallback(() => {
    refresh((coords) => {
      dispatch(fetchWeatherRequest(coords));
    });
  }, [refresh, dispatch]);

  return (
    <button
      className="location-btn"
      onClick={handleLocationClick}
      disabled={loading}
      title="Use my location"
      aria-label="Use my location"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
      </svg>
    </button>
  );
}
