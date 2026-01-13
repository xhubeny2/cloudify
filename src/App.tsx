import "./App.css";
import { WeatherComp } from "./components/weather/WeatherComp";
import InputWrapper from "./components/InputWrapper.tsx";

function App() {
  return (
    <main>
      <div>
        <h1>Cloudify</h1>
        <InputWrapper />
        <WeatherComp />
      </div>
    </main>
  );
}

export default App;
