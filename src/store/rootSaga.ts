import { all, fork, spawn } from "redux-saga/effects";
import { watchWeather } from "./weather";
import { cityRootSaga } from "./cities";

export default function* rootSaga() {
  yield all([fork(watchWeather), spawn(cityRootSaga)]);
}
