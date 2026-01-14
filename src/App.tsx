import "./App.scss";
import Header from "@/components/layout/Header";
import { WeatherContainer } from "@/components/weather";

function App() {
  return (
    <main>
      <Header />
      <WeatherContainer />
    </main>
  );
}

export default App;
