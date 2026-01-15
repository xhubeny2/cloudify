import { memo, useCallback } from "react";
import type { ReducedCity } from "@/store/types.ts";
import { useAppDispatch } from "@/store";
import { fetchWeatherRequest } from "@/store/weather";
import { setSearchResults } from "@/store/cities";

export type ListItemProps = {
  city: ReducedCity;
  clearInput: () => void;
};

const ListItem = memo(function ListItem({ city, clearInput }: ListItemProps) {
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(fetchWeatherRequest(city.coord));
    dispatch(setSearchResults([]));
    clearInput();
  }, [city, dispatch, clearInput]);

  return (
    <li onClick={handleClick}>
      {city.name}, {city.country}
    </li>
  );
});

export default ListItem;
