export interface WeatherInput {
  location?: string;
  lat?: number;
  lon?: number;
}

export interface WeatherResult {
  location: {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    weatherCode: number;
    weatherDescription: string;
    windSpeed: number;
    windDirection: number;
  };
  daily: Array<{
    date: string;
    weatherCode: number;
    weatherDescription: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitationSum: number;
    windSpeedMax: number;
  }>;
}

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code] || `Unknown (code ${code})`;
}

async function geocodeLocation(location: string): Promise<{ latitude: number; longitude: number; name: string } | null> {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new Error(`Geocoding API returned status ${geoResponse.status}`);
  }
  const geoData = geoResponse.json() as unknown as { results?: Array<{ latitude: number; longitude: number; name: string }> };
  const data = await geoData;
  if (!data.results || data.results.length === 0) {
    return null;
  }
  return data.results[0];
}

export async function getWeather(input: WeatherInput): Promise<WeatherResult> {
  let latitude: number;
  let longitude: number;
  let locationName: string;

  if (input.lat !== undefined && input.lon !== undefined) {
    latitude = input.lat;
    longitude = input.lon;
    locationName = `${latitude}, ${longitude}`;
  } else if (input.location) {
    // Try geocoding with the full location string first
    let geoResult = await geocodeLocation(input.location);

    // If not found and contains comma (e.g., "City, State" or "City, Country"),
    // retry with just the city part (open-meteo often fails with suffixes)
    if (!geoResult && input.location.includes(",")) {
      const cityPart = input.location.split(",")[0].trim();
      geoResult = await geocodeLocation(cityPart);
    }

    if (!geoResult) {
      throw new Error(`Location not found: ${input.location}`);
    }
    latitude = geoResult.latitude;
    longitude = geoResult.longitude;
    locationName = geoResult.name;
  } else {
    throw new Error("Either location or lat+lon must be provided");
  }

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;

  const response = await fetch(forecastUrl);
  if (!response.ok) {
    throw new Error(`Weather API returned status ${response.status}`);
  }

  const data = await response.json() as {
    timezone: string;
    current: {
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      precipitation: number;
      weather_code: number;
      wind_speed_10m: number;
      wind_direction_10m: number;
    };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_sum: number[];
      wind_speed_10m_max: number[];
    };
  };

  const daily = data.daily.time.map((date: string, i: number) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    weatherDescription: getWeatherDescription(data.daily.weather_code[i]),
    temperatureMax: data.daily.temperature_2m_max[i],
    temperatureMin: data.daily.temperature_2m_min[i],
    precipitationSum: data.daily.precipitation_sum[i],
    windSpeedMax: data.daily.wind_speed_10m_max[i],
  }));

  return {
    location: {
      name: locationName,
      latitude,
      longitude,
      timezone: data.timezone,
    },
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      weatherDescription: getWeatherDescription(data.current.weather_code),
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
    },
    daily,
  };
}
