import "./App.scss";
import { Header, Footer } from "@/components/layout";
import { WeatherContainer } from "@/components/weather";

function App() {
  return (
    <main>
      <Header />
      <WeatherContainer />
      <Footer />
    </main>
  );
}

export default App;
