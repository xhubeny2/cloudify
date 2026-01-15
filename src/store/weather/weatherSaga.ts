import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchWeatherRequest,
  fetchWeatherSuccess,
  fetchWeatherFailure,
} from ".";
import { fetchForecast } from "@/api/weather";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FetchWeatherPayload, WeatherForecastResponse } from "../types";

// Worker saga - async operations and putting actions to the store
function* fetchWeatherSaga(action: PayloadAction<FetchWeatherPayload>) {
  try {
    const { lat, lon } = action.payload;
    const data: WeatherForecastResponse = yield call(fetchForecast, {
      lat,
      lon,
    });
    yield put(fetchWeatherSuccess(data));
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Nepodařilo se načíst předpověď počasí";
    yield put(fetchWeatherFailure(errorMessage));
  }
}

// Watcher saga - watch for actions
// takeLatest ensures only the latest request is processed
export function* watchWeather() {
  yield takeLatest(fetchWeatherRequest.type, fetchWeatherSaga);
}
