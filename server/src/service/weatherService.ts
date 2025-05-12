import dotenv from "dotenv";
import dayjs from "dayjs";
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

// Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string = "";

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "https://api.openweathermap.org";
    this.apiKey = process.env.API_KEY || "";

    if (!this.apiKey) {
      console.error("API_KEY is not defined in environment variables");
    }
  }

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const geocodeURL = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;

    const response = await fetch(geocodeURL);

    if (!response.ok) {
      throw new Error(`Failed to fetch location data: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("Location not found");
    }

    return data[0];
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherURL = this.buildWeatherQuery(coordinates);

    const response = await fetch(weatherURL);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }

    return await response.json();
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { city, list } = response;
    const currentWeather = list[0];

    return {
      city: city.name,
      date: dayjs(currentWeather.dt_txt).format("MM/DD/YYYY"),
      icon: currentWeather.weather[0].icon,
      iconDescription: currentWeather.weather[0].description,
      tempF: Math.round(currentWeather.main.temp),
      windSpeed: Math.round(currentWeather.wind.speed),
      humidity: Math.round(currentWeather.main.humidity),
    };
  }

  // Complete buildForecastArray method
  private buildForecastArray(
    currentWeather: Weather,
    weatherData: any
  ): Weather[] {
    const { city, list } = weatherData;
    const forecastArray: Weather[] = [currentWeather];

    // Group forecast data by day and select noon (or closest time) for each day
    const dailyForecasts = new Map<string, any>();

    list.forEach((item: any) => {
      const date = dayjs(item.dt_txt).format("YYYY-MM-DD");
      const hour = dayjs(item.dt_txt).hour();

      // If we don't have this date yet, or if this hour is closer to noon than the one we have
      if (
        !dailyForecasts.has(date) ||
        Math.abs(hour - 12) < Math.abs(dailyForecasts.get(date).hour - 12)
      ) {
        dailyForecasts.set(date, {
          ...item,
          hour,
        });
      }
    });

    // Skip today and get next 5 days
    const uniqueDays = Array.from(dailyForecasts.keys()).sort();
    const forecastDays = uniqueDays.slice(1, 6);

    forecastDays.forEach((day) => {
      const forecast = dailyForecasts.get(day);

      forecastArray.push({
        city: city.name,
        date: dayjs(forecast.dt_txt).format("MM/DD/YYYY"),
        icon: forecast.weather[0].icon,
        iconDescription: forecast.weather[0].description,
        tempF: Math.round(forecast.main.temp),
        windSpeed: Math.round(forecast.wind.speed),
        humidity: Math.round(forecast.main.humidity),
      });
    });

    return forecastArray;
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;

    try {
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);

      return this.buildForecastArray(currentWeather, weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }
}

export default new WeatherService();
