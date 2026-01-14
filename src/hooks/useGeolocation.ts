import { useState, useEffect, useCallback } from "react";

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_COORDINATES: Coordinates = {
  lat: 50.0755,
  lon: 14.4378,
}; // Praha

export function useGeolocation() {
  const isSupported =
    typeof navigator !== "undefined" && !!navigator.geolocation;

  const [state, setState] = useState<GeolocationState>(() =>
    isSupported
      ? { coordinates: null, loading: true, error: null }
      : {
          coordinates: DEFAULT_COORDINATES,
          loading: false,
          error: "Geolocation is not supported",
        },
  );

  const getCurrentPosition = useCallback(
    (onSuccess?: (coords: Coordinates) => void) => {
      if (!isSupported) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setState({
            coordinates: coords,
            loading: false,
            error: null,
          });
          onSuccess?.(coords);
        },
        (error) => {
          setState({
            coordinates: DEFAULT_COORDINATES,
            loading: false,
            error: error.message,
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 mins cache
        },
      );
    },
    [isSupported],
  );

  useEffect(() => {
    if (isSupported) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- setState is called asynchronously in geolocation callbacks
      getCurrentPosition();
    }
  }, [getCurrentPosition, isSupported]);

  return {
    ...state,
    refresh: getCurrentPosition,
    DEFAULT_COORDINATES,
  };
}
