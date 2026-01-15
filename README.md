# Cloudify 🌤️

Moderní webová aplikace pro zobrazení počasí s automatickou geolokací a vyhledáváním měst. Postaveno na React 19 s důrazem na výkon a UX.

## Hlavní funkce

- **Automatická geolokace** - Aplikace zjistí polohu uživatele a zobrazí počasí pro jeho lokalitu
- **Vyhledávání měst** - Rychlé vyhledávání v databázi 40 000+ měst s podporou diakritiky
- **Aktuální počasí** - Teplota, pocitová teplota, vlhkost, rychlost větru
- **5denní předpověď** - Přehledná tabulka s možností zobrazit detail
- **Interaktivní graf teplot** - Vizualizace teplot pro vybraný den

---

## Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| **Framework** | React 19.2 |
| **Jazyk** | TypeScript 5.9 |
| **Build Tool** | Vite 7.2 (s SWC pro Fast Refresh) |
| **State Management** | Redux Toolkit + Redux Saga |
| **Styling** | SCSS (s mixiny a proměnnými) |
| **Grafy** | Recharts |
| **Package Manager** | pnpm |

---

## Architektura aplikace

### Struktura projektu

```
src/
├── api/                    # API komunikace s OpenWeatherMap
│   └── weather.ts
├── components/
│   ├── layout/            # Header, Footer, LocationButton
│   ├── weather/           # CurrentWeather, ForecastTable, TemperatureChart
│   ├── search/            # InputWrapper (autocomplete vyhledávání)
│   └── ui/                # Card, Button, Dialog, Loader, ErrorMessage
├── hooks/
│   └── useGeolocation.ts  # Custom hook pro geolokaci
├── store/
│   ├── weather/           # Weather slice + saga
│   ├── cities/            # Cities slice + saga
│   └── index.ts           # Store konfigurace
├── workers/
│   └── cityWorker.ts      # Web Worker pro vyhledávání
├── styles/                # SCSS (_variables, _mixins, _reset)
└── utils/                 # Utility funkce (removeDiacritics)
```

### State Management Flow

```
Uživatel → Akce → Redux Store → Saga → API/Worker → Store Update → React Re-render
```

---

## Řešené problémy a úskalí

### 1. Obří dataset měst (2+ miliony řádků)

**Problém:**
Soubor `city.list.json` z OpenWeatherMap API obsahuje přes 2 miliony řádků (cca 40MB). Původně byl součástí git repozitáře, což způsobovalo:
- Pomalé klonování repozitáře
- Zbytečné zvětšení velikosti repozitáře
- Problémy s git diff a blame

**Řešení:**
Vytvořen build script `scripts/download-cities.js`, který stahuje data až při buildu:

```javascript
// scripts/download-cities.js
const response = await fetch('https://bulk.openweathermap.org/sample/city.list.json.gz');
// ... rozbalení a uložení do public/city.list.json
```

**Výsledek:**
- Čistý git repozitář
- Data se stahují pouze jednou při buildu
- Soubor je dostupný v `/public` pro runtime fetch

---

### 2. Vyhledávání bez blokování UI (Web Worker)

**Problém:**
Filtrování 2+ milionů záznamů při každém stisku klávesy by zablokovalo main thread na několik sekund, což by způsobilo "zamrznutí" UI.

**Řešení:**
Implementace Web Workeru pro off-main-thread processing:

```typescript
// src/workers/cityWorker.ts
onmessage = (e: MessageEvent<WorkerInputMessage>) => {
  if (e.data.type === 'SEARCH_QUERY') {
    const query = removeDiacritics(e.data.payload.toLowerCase());
    const results = cities
      .filter(city => removeDiacritics(city.name.toLowerCase()).startsWith(query))
      .slice(0, 10);
    postMessage({ type: 'SEARCH_RESULTS', payload: results });
  }
};
```

**Komunikace přes Redux Saga s eventChannel:**

```typescript
// src/store/cities/citiesSaga.ts
function createWorkerChannel(worker: Worker): EventChannel<WorkerOutputMessage> {
  return eventChannel((emitter) => {
    worker.onmessage = (e) => emitter(e.data);
    return () => worker.terminate();
  });
}

function* watchWorkerMessages(channel: EventChannel<WorkerOutputMessage>) {
  while (true) {
    const message: WorkerOutputMessage = yield take(channel);
    if (message.type === 'SEARCH_RESULTS') {
      yield put(setSearchResults(message.payload));
    }
  }
}
```

**Debouncing v Saga:**

```typescript
function* searchCities(worker: Worker, action: PayloadAction<string>) {
  yield delay(300); // 300ms debounce
  worker.postMessage({ type: 'SEARCH_QUERY', payload: action.payload });
}
```

**Výsledek:**
- Plynulé vyhledávání bez zamrznutí UI
- Výsledky do 10ms i při 2M záznamech
- Podpora vyhledávání bez diakritiky ("Prostějov" i "prostejov")

---

### 3. Geolokace s fallbackem

**Problém:**
Browser Geolocation API:
- Uživatel může odmítnout oprávnění
- Může selhat kvůli timeoutu

**Řešení:**
Custom hook `useGeolocation` s robustním error handlingem:

```typescript
// src/hooks/useGeolocation.ts
const DEFAULT_COORDINATES: Coordinates = {
  lat: 50.0755,
  lon: 14.4378,
}; // Praha jako fallback

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(() =>
    isSupported
      ? { coordinates: null, loading: true, error: null }
      : { coordinates: DEFAULT_COORDINATES, loading: false, error: 'Geolocation is not supported' }
  );

  const getCurrentPosition = useCallback((onSuccess?: (coords: Coordinates) => void) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lon: position.coords.longitude };
        setState({ coordinates: coords, loading: false, error: null });
        onSuccess?.(coords);
      },
      (error) => {
        setState({ coordinates: DEFAULT_COORDINATES, loading: false, error: error.message });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,        // 10 sekund timeout
        maximumAge: 300000,    // 5 minut cache
      }
    );
  }, []);

  return { ...state, refresh: getCurrentPosition, DEFAULT_COORDINATES };
}
```

**Výsledek:**
- Vždy fungující aplikace (fallback na Prahu)
- Caching výsledků po dobu 5 minut
- Možnost manuálního refreshe polohy

---

### 4. Optimalizace renderů (React Performance)

**Problém:**
Při změně state (např. při psaní do vyhledávání) se re-renderovaly všechny komponenty, včetně těch, které se nezměnily.

**Řešení:**
Strategická aplikace React optimalizačních technik:

**React.memo pro presentační komponenty:**

```typescript
// Zabraňuje re-renderu když se props nezmění
export const CurrentWeather = memo(function CurrentWeather({ city, current }: CurrentWeatherProps) {
  // ...
});

export const ForecastRow = memo(function ForecastRow({ day, index, onSelect }: ForecastRowProps) {
  // ...
});
```

**useCallback pro stabilní reference funkcí:**

```typescript
// Reference funkce se nemění mezi rendery
const handleRowClick = useCallback((index: number) => {
  setSelectedDay(index);
}, []);
```

**useMemo pro drahé výpočty:**

```typescript
// Groupování dat se počítá jen když se změní `list`
const days = useMemo(() => groupByDay(list), [list]);

// Chart data se přepočítá jen když se změní `items`
const chartData = useMemo(() =>
  items.map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
  })),
  [items]
);
```

---

### 5. Bundle size optimalizace (Lazy Loading)

**Problém:**
Komponenta `TemperatureChart` používá knihovnu Recharts, která výrazně zvyšuje velikost initial bundle. Graf se přitom zobrazuje jen když uživatel klikne na řádek v tabulce.

**Řešení:**
React.lazy + Suspense pro lazy loading:

```typescript
// src/components/weather/ForecastTable.tsx
const TemperatureChart = lazy(() =>
  import('./TemperatureChart').then(m => ({ default: m.TemperatureChart }))
);

export function ForecastTable({ list }: ForecastTableProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <>
      {/* Tabulka s předpovědí */}
      <Dialog isOpen={selectedDay !== null} onClose={closeDialog}>
        {selectedDay !== null && (
          <Suspense fallback={<Loader size="sm" />}>
            <TemperatureChart items={days[selectedDay].items} />
          </Suspense>
        )}
      </Dialog>
    </>
  );
}
```

**Výsledek:**
- Menší initial bundle (Recharts se načte až při otevření prvního dialogu)
---

### 6. Lokalizace data a času

**Problém:**
Původně bylo hardcodované `"en-EN"` locale pro formátování data, což zobrazovalo anglické názvy dnů a měsíců i českým uživatelům.

**Řešení:**
Použití `undefined` jako locale pro automatickou detekci z prohlížeče:

```typescript
// Před
new Date(dt * 1000).toLocaleDateString('en-EN', { weekday: 'long' });
// Výsledek: "Monday"

// Po
new Date(dt * 1000).toLocaleDateString(undefined, { weekday: 'long' });
// Výsledek: "Pondělí" (v českém prohlížeči)
```

**Výsledek:**
- Automatická lokalizace podle nastavení prohlížeče
- Čeští uživatelé vidí české názvy dnů

---

## Další implementační vzory

### Typovaný Redux

```typescript
// Typované hooks pro Redux
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Typované akce
fetchWeatherRequest: (state, _action: PayloadAction<FetchWeatherPayload>) => {
  state.loading = true;
};
```

### Path aliasy pro čisté importy

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// Použití
import { useAppDispatch } from '@/store';
import { Button } from '@/components/ui/Button';
```

### Utility funkce pro diakritiku

```typescript
// src/utils/removeDiacritics.ts
export const removeDiacritics = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// "Příbram" → "Pribram"
// "Česká Lípa" → "Ceska Lipa"
```

---

## Jak spustit projekt

### Prerekvizity

- Node.js 22+
- pnpm

### Instalace

```bash
# Klonování repozitáře
git clone <repo-url>
cd cloudify

# Instalace závislostí
pnpm install
```

### Environment variables

Vytvořit soubor `.env` v kořenové složce:

```env
VITE_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_OPENWEATHER_API_KEY=tvuj_api_klic
```

API klíč zdarma na [OpenWeatherMap](https://openweathermap.org/api).

### Spuštění DEV serveru

```bash
# Nainstalují se závislosti
pnpm install

# Stáhne city.list.json do /public
pnpm download-cities 

# Spustí Vite dev server
pnpm dev 
```
### Build a preview produkce

```bash
# Build pro produkci (stáhne města + TypeScript check + Vite build)
pnpm build

# Náhled produkčního buildu
pnpm preview
```

---

## Licence

MIT
