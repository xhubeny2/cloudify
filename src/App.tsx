import "./App.scss";
import { WeatherComp } from "./components/weather/WeatherComp";
import Header from "@/components/layout/Header";

function App() {
  return (
    <main>
      <Header />
      {/*<div>*/}
      {/*  <h1>Cloudify</h1>*/}
      {/*  <InputWrapper />*/}
      <WeatherComp />
      {/*</div>*/}
    </main>
  );
}

export default App;
