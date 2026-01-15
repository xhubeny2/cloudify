import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  WeatherState,
  WeatherForecastResponse,
  FetchWeatherPayload,
} from "../types.ts";

const initialState: WeatherState = {
  forecast: null,
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // Start data fetch
    fetchWeatherRequest: (
      state,
      _action: PayloadAction<FetchWeatherPayload>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    // Successful data fetch
    fetchWeatherSuccess: (
      state,
      action: PayloadAction<WeatherForecastResponse>,
    ) => {
      state.loading = false;
      state.forecast = action.payload;
      state.error = null;
    },
    // Loading error
    fetchWeatherFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Reset status
    clearWeather: (state) => {
      state.forecast = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchWeatherRequest,
  fetchWeatherSuccess,
  fetchWeatherFailure,
  clearWeather,
} = weatherSlice.actions;

export default weatherSlice.reducer;
