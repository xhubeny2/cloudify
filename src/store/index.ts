import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { weatherReducer } from "./weather";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

// Store configuration with reducers and saga middleware setup
export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// Types export
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export hooks
export { useAppDispatch, useAppSelector } from "./hooks";
