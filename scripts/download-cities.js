import { createWriteStream, mkdirSync } from "fs";
import { dirname } from "path";
import { pipeline } from "stream/promises";
import { createGunzip } from "zlib";

const CITY_LIST_URL =
  "https://bulk.openweathermap.org/sample/city.list.json.gz";
const OUTPUT_PATH = "public/city.list.json";

async function downloadCities() {
  console.log("Downloading city list from OpenWeatherMap...");

  const response = await fetch(CITY_LIST_URL);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`);
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

  const gunzip = createGunzip();
  const output = createWriteStream(OUTPUT_PATH);

  await pipeline(response.body, gunzip, output);

  console.log(`City list saved to ${OUTPUT_PATH}`);
}

downloadCities().catch((error) => {
  console.error("Error downloading city list:", error);
  process.exit(1);
});
