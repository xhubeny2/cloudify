import { all, fork } from "redux-saga/effects";
import { watchWeather } from "./weather";

export default function* rootSaga() {
  yield all([fork(watchWeather)]);
}
