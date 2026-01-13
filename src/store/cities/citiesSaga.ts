import { put, delay, call, take, fork, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  setSearchResults,
  cityOperationFailure,
  initCitiesSuccess,
  searchCitiesRequest,
  initCitiesRequest,
} from "./citiesSlice";
import { eventChannel } from "redux-saga";
import type { EventChannel, SagaIterator } from "redux-saga";
import type {
  City,
  ReducedCity,
  WorkerInputMessage,
  WorkerOutputMessage,
} from "../types.ts";
import { WORKER_TYPES } from "../../constants";

function createWorkerChannel(
  worker: Worker,
): EventChannel<WorkerOutputMessage> {
  return eventChannel((emitter) => {
    worker.onmessage = (e: MessageEvent<WorkerOutputMessage>) => {
      emitter(e.data);
    };
    return () => {
      worker.terminate();
    };
  });
}

function* initCitiesSaga(worker: Worker): SagaIterator {
  try {
    // load city data from local JSON file
    const response: Response = yield call(fetch, "./city.list.json");
    const rawData: City[] = yield call([response, "json"]);

    // optimization: reduce data size before sending to worker
    const optimizedData: ReducedCity[] = rawData.map((c: City) => ({
      id: c.id,
      name: c.name,
      country: c.country,
      coord: { lat: c.coord.lat, lon: c.coord.lon },
    }));

    // send optimized data to worker
    const initMsg: WorkerInputMessage = {
      type: WORKER_TYPES.INIT_DATA,
      payload: optimizedData,
    };
    worker.postMessage(initMsg);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Initializing cities data failed";
    yield put(cityOperationFailure(errorMessage));
  }
}

// watch for messages from the worker
function* watchWorkerChannel(worker: Worker): SagaIterator {
  const channel: EventChannel<WorkerOutputMessage> = yield call(
    createWorkerChannel,
    worker,
  );

  while (true) {
    const action: WorkerOutputMessage = yield take(channel);

    switch (action.type) {
      case WORKER_TYPES.READY:
        yield put(initCitiesSuccess());
        break;
      case WORKER_TYPES.SEARCH_RESULTS:
        yield put(setSearchResults(action.payload));
        break;
      default:
        break;
    }
  }
}

function* searchCities(
  worker: Worker,
  action: PayloadAction<string>,
): SagaIterator {
  const query = action.payload;
  if (query.length < 3) {
    yield put(setSearchResults([]));
    return;
  }

  yield delay(300); // 300ms debounce
  worker.postMessage({ type: "SEARCH_QUERY", payload: query });
}

export function* cityRootSaga() {
  // initialize web worker
  const worker = new Worker(
    new URL("../../workers/cityWorker.ts", import.meta.url),
    { type: "module" },
  );

  // start watching worker messages
  yield fork(watchWorkerChannel, worker);
  yield takeLatest(initCitiesRequest.type, initCitiesSaga, worker);

  // listen for search requests
  yield takeLatest(searchCitiesRequest.type, searchCities, worker);
}
