import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { initCitiesRequest, searchCitiesRequest } from "../store/cities";

export function InputWrapper() {
  const dispatch = useAppDispatch();
  const { results, isInitializing } = useAppSelector((state) => state.cities);

  useEffect(() => {
    dispatch(initCitiesRequest());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle input change logic here
    console.log("handleInputChange", e.target.value);
    dispatch(searchCitiesRequest(e.currentTarget.value));
  };

  return (
    <div className="input-wrapper">
      <input onChange={handleInputChange} />
      {isInitializing && <p>Initializing...</p>}
      {results && (
        <ul>
          {results.map((city) => (
            <li key={city.id}>
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InputWrapper;
