import type {
  ReducedCity,
  WorkerInputMessage,
  WorkerOutputMessage,
} from "../store/types.ts";
import { WORKER_TYPES } from "../constants";
import { removeDiacritics } from "../utils";

let cities: ReducedCity[] = [];

const sendToMainThread = (message: WorkerOutputMessage) => {
  postMessage(message);
};

onmessage = (e: MessageEvent<WorkerInputMessage>) => {
  const { type, payload } = e.data;

  if (type === WORKER_TYPES.INIT_DATA) {
    cities = payload;
    sendToMainThread({ type: WORKER_TYPES.READY });
  }

  if (type === WORKER_TYPES.SEARCH_QUERY) {
    const query = removeDiacritics(payload.toLowerCase());
    const results = cities
      .filter((city) =>
        removeDiacritics(city.name.toLowerCase()).startsWith(query),
      )
      .slice(0, 10);

    sendToMainThread({ type: WORKER_TYPES.SEARCH_RESULTS, payload: results });
  }
};
