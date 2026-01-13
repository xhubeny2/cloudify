import type { ReducedCity } from "@/store/types.ts";
import { useAppDispatch } from "@/store";
import { fetchWeatherRequest } from "@/store/weather";
import { setSearchResults } from "@/store/cities";

export type ListItemProps = {
  city: ReducedCity;
  clearInput: () => void;
};

function ListItem({ city, clearInput }: ListItemProps) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    console.log(`City selected: ${city.name}, ${city.country}`);
    dispatch(fetchWeatherRequest(city.coord));
    dispatch(setSearchResults([]));
    clearInput();
  };

  return (
    <li onClick={handleClick}>
      {city.name}, {city.country}
    </li>
  );
}

export default ListItem;
