import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { initCitiesRequest, searchCitiesRequest } from "@/store/cities";
import "./style.scss";
import ListItem from "@/components/search/ListItem.tsx";
import type { ChangeEvent } from "react";

export function InputWrapper() {
  const dispatch = useAppDispatch();
  const { results, isInitializing } = useAppSelector((state) => state.cities);
  const [value, setValue] = useState("");

  useEffect(() => {
    dispatch(initCitiesRequest());
  }, [dispatch]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(searchCitiesRequest(e.currentTarget.value));
      setValue(e.currentTarget.value);
    },
    [dispatch],
  );

  const clearInput = useCallback(() => {
    setValue("");
  }, []);

  return (
    <div className="input-wrapper">
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        onChange={handleInputChange}
        className="city-input"
        placeholder={isInitializing ? "Initializing..." : "Search city..."}
        disabled={isInitializing}
        value={value}
      />
      {results && results.length > 0 && (
        <ul className="results-list">
          {results.map((city) => (
            <ListItem key={city.id} city={city} clearInput={clearInput} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default InputWrapper;
