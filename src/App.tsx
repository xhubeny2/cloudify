import "./App.css";
import { WeatherComp } from "./components/weather/WeatherComp";

function App() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div>
        <h1>Cloudify</h1>
        <WeatherComp />
      </div>
    </main>
  );
}

export default App;
