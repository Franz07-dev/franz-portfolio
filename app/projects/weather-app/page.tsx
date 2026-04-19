"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────
type Weather = {
  city:        string;
  country:     string;
  temp:        number;
  feels_like:  number;
  description: string;
  icon:        string;
  humidity:    number;
  wind:        number;
  visibility:  number;
};

type ForecastDay = {
  date:     string;
  day:      string;
  temp_min: number;
  temp_max: number;
  icon:     string;
};

// Max number of recent searches to remember
const MAX_HISTORY = 5;

// ── Weather code → emoji + label ──────────────────────────────────────────────
function getWeatherInfo(code: number): { icon: string; description: string } {
  if (code === 0)               return { icon: "☀️",  description: "Clear sky" };
  if (code === 1)               return { icon: "🌤️",  description: "Mostly clear" };
  if (code === 2)               return { icon: "⛅",  description: "Partly cloudy" };
  if (code === 3)               return { icon: "☁️",  description: "Overcast" };
  if (code >= 45 && code <= 48) return { icon: "🌫️",  description: "Foggy" };
  if (code >= 51 && code <= 55) return { icon: "🌦️",  description: "Drizzle" };
  if (code >= 61 && code <= 65) return { icon: "🌧️",  description: "Rain" };
  if (code >= 71 && code <= 77) return { icon: "❄️",  description: "Snow" };
  if (code >= 80 && code <= 82) return { icon: "🌧️",  description: "Rain showers" };
  if (code >= 85 && code <= 86) return { icon: "🌨️",  description: "Snow showers" };
  if (code === 95)              return { icon: "⛈️",  description: "Thunderstorm" };
  if (code >= 96 && code <= 99) return { icon: "⛈️",  description: "Thunderstorm with hail" };
  return { icon: "🌡️", description: "Unknown" };
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
// Shown while fetching. Mimics the shape of the real cards so the page
// doesn't feel empty or jumpy during the API call.
function SkeletonLoader() {
  return (
    <div style={{ animation: "fade-up 0.4s ease both" }}>
      {/* Current weather card skeleton */}
      <div className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl p-7 mb-3">
        <div className="flex justify-between items-start mb-5">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-36 rounded bg-[#1e2a38] sk" />
            <div className="h-3 w-24 rounded bg-[#1e2a38] sk" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1e2a38] sk" />
        </div>
        <div className="h-16 w-32 rounded bg-[#1e2a38] mb-2 sk" />
        <div className="h-3 w-24 rounded bg-[#1e2a38] mb-6 sk" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-[#1e2a38] sk" />
          ))}
        </div>
      </div>

      {/* Forecast card skeleton */}
      <div className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl p-7">
        <div className="h-3 w-28 rounded bg-[#1e2a38] mb-4 sk" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-[#1e2a38] sk" />
          ))}
        </div>
      </div>

      {/* Inline keyframes so we don't touch globals.css */}
      <style>{`
        @keyframes sk-pulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.7; }
        }
        .sk { animation: sk-pulse 1.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WeatherApp() {
  const router = useRouter();
  const [city, setCity]         = useState("");
  const [weather, setWeather]   = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Store up to MAX_HISTORY cities, most recent first, deduplicated
  const [history, setHistory] = useState<string[]>([]);

  // Adds city to front of history, removes duplicates, caps at MAX_HISTORY
  function addToHistory(cityName: string) {
    setHistory((prev) => {
      // filter() removes any existing entry for this city (case-insensitive)
      const deduped = prev.filter(
        (c) => c.toLowerCase() !== cityName.toLowerCase()
      );
      // Put the new city first, then slice to keep only MAX_HISTORY items
      return [cityName, ...deduped].slice(0, MAX_HISTORY);
    });
  }

  async function searchWeather(query = city) {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      // Step 1: city name → coordinates (free API, no key required)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Check the spelling and try again.");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: coordinates → weather + 5-day forecast
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,visibility` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto&forecast_days=6`
      );
      const weatherData = await weatherRes.json();

      const current = weatherData.current;
      const daily   = weatherData.daily;
      const info    = getWeatherInfo(current.weather_code);

      setWeather({
        city:        name,
        country:     country,
        temp:        Math.round(current.temperature_2m),
        feels_like:  Math.round(current.apparent_temperature),
        description: info.description,
        icon:        info.icon,
        humidity:    current.relative_humidity_2m,
        wind:        Math.round(current.wind_speed_10m),
        visibility:  Math.round((current.visibility || 10000) / 1000),
      });

      const days: ForecastDay[] = daily.time
        .slice(1, 6)
        .map((dateStr: string, i: number) => {
          const date    = new Date(dateStr);
          const dayInfo = getWeatherInfo(daily.weather_code[i + 1]);
          return {
            date:     date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            day:      date.toLocaleDateString("en-US", { weekday: "short" }),
            temp_min: Math.round(daily.temperature_2m_min[i + 1]),
            temp_max: Math.round(daily.temperature_2m_max[i + 1]),
            icon:     dayInfo.icon,
          };
        });

      setForecast(days);

      // Save the resolved city name (not raw input) so "manila" → "Manila"
      addToHistory(name);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") searchWeather();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 md:py-24">

      {/* ── Back Button ── */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:opacity-70"
        style={{ color: "#2dd4bf" }}
      >
        ← Back to Projects
      </button>

      {/* ── Header ── */}
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[#2dd4bf] mb-2">
          Weather App
        </p>
        <h1 className="font-serif text-4xl md:text-5xl leading-tight">
          What&apos;s the weather<br />
          <span className="text-[#64748b]">like today?</span>
        </h1>
      </div>

      {/* ── Search ── */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="flex-1 px-4 py-3 bg-[#0e1420] border border-[#1e2a38] rounded-xl text-[#e8edf2] placeholder-[#64748b] font-sans text-sm outline-none transition-colors focus:border-[#2dd4bf]"
          placeholder="Enter a city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          disabled={loading}
        />
        <button
          className="px-6 py-3 bg-[#2dd4bf] text-[#080c10] rounded-xl font-sans text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-85 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => searchWeather()}
          disabled={loading || !city.trim()}
        >
          {loading ? "Searching…" : "Search →"}
        </button>
      </div>

      {/* Search history chips */}
      {/* Only shown when we have history AND we're not currently loading */}
      {history.length > 0 && !loading && (
        <div className="flex flex-wrap gap-2 mb-6">
          {history.map((item) => (
            <button
              key={item}
              // Clicking a chip searches that city directly and fills the input
              onClick={() => {
                setCity(item);
                searchWeather(item);
              }}
              className="px-3 py-1 text-xs font-mono text-[#64748b] bg-[#0e1420] border border-[#1e2a38] rounded-full transition-colors hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
            >
              {item}
            </button>
          ))}
          {/* Clear all history */}
          <button
            onClick={() => setHistory([])}
            className="px-3 py-1 text-xs font-mono text-[#64748b] hover:text-[#f87171] transition-colors"
          >
            clear
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="p-4 mb-6 bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.3)] rounded-xl text-[#f87171] text-sm">
          {error}
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && <SkeletonLoader />}

      {/* ── Empty / idle state ── */}
      {!loading && !weather && !error && (
        <div
          style={{ animation: "fade-up 0.5s ease 0.25s both" }}
          className="py-16 text-center"
        >
          <p className="text-5xl mb-3">🌤️</p>
          <p className="text-[#64748b] text-sm">Search a city to see the weather</p>
        </div>
      )}

      {/* ── Current weather ── */}
      {weather && !loading && (
        <div
          style={{ animation: "fade-up 0.5s ease 0.05s both" }}
          className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl p-7 mb-3"
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="font-serif text-2xl leading-tight mb-1">
                {weather.city}, {weather.country}
              </h2>
              <p className="text-[#64748b] text-sm">{weather.description}</p>
            </div>
            <span className="text-5xl leading-none">{weather.icon}</span>
          </div>

          <p className="font-serif text-7xl leading-none text-[#2dd4bf] mb-1">
            {weather.temp}
            <span className="text-4xl">°C</span>
          </p>
          <p className="text-[#64748b] text-xs mb-6">Feels like {weather.feels_like}°C</p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Humidity",   value: weather.humidity + "%" },
              { label: "Wind",       value: weather.wind + " km/h" },
              { label: "Visibility", value: weather.visibility + " km" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#080c10] border border-[#1e2a38] rounded-xl p-3 text-center">
                <p className="font-mono text-xs uppercase tracking-wider text-[#64748b] mb-1">
                  {label}
                </p>
                <p className="font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5-day forecast ── */}
      {forecast.length > 0 && !loading && (
        <div
          style={{ animation: "fade-up 0.5s ease 0.15s both" }}
          className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl p-7 mb-3"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-[#2dd4bf] mb-4">
            5-Day Forecast
          </p>
          {forecast.map((day, i) => (
            <div
              key={day.date}
              // Each row fades in slightly after the previous one
              style={{ animation: `fade-up 0.4s ease ${0.1 + i * 0.07}s both` }}
              className="flex items-center py-3 border-b border-[#1e2a38] last:border-b-0 gap-4"
            >
              <span className="font-semibold text-sm w-10">{day.day}</span>
              <span className="text-[#64748b] text-xs flex-1">{day.date}</span>
              <span className="text-2xl">{day.icon}</span>
              <div className="flex gap-3">
                <span className="text-[#64748b] text-sm">{day.temp_min}°</span>
                <span className="font-semibold text-sm text-[#2dd4bf]">{day.temp_max}°</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}