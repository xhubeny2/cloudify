import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CitiesState, ReducedCity } from "../types";

const initialState: CitiesState = {
  results: null,
  isInitializing: false,
  isSearching: false,
  error: null,
};

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    // initialize cities data
    initCitiesRequest: (state) => {
      state.isInitializing = true;
    },
    // cities data initialized successfully
    initCitiesSuccess: (state) => {
      state.isInitializing = false;
    },

    searchCitiesRequest: (state, _action: PayloadAction<string>) => {
      state.isSearching = true;
    },
    // set search results
    setSearchResults: (state, action: PayloadAction<ReducedCity[]>) => {
      state.results = action.payload;
      state.isSearching = false;
    },
    // handle operation failure
    cityOperationFailure: (state, action: PayloadAction<string>) => {
      state.isInitializing = false;
      state.isSearching = false;
      state.error = action.payload;
    },
  },
});

export const {
  initCitiesRequest,
  initCitiesSuccess,
  searchCitiesRequest,
  setSearchResults,
  cityOperationFailure,
} = citiesSlice.actions;

export default citiesSlice.reducer;
