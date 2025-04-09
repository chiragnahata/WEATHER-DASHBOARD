
/**
 * Weather Service - Fetches weather data from OpenWeatherMap API
 */

// OpenWeatherMap API key
const API_KEY = "d2d7682ffe4789d0fb3f2241f44a39d1"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Weather data interface
 */
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  condition: string;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  coords: {
    lat: number;
    lon: number;
  };
  windDirection: number;
  cloudiness: number;
}

/**
 * Fetch weather data for a given city
 * @param city - The city name to fetch weather data for
 * @returns Promise<WeatherData> - The weather data
 */
export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    // Fetch weather data from OpenWeatherMap API (available in free plan)
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    // If response is not ok, throw an error
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your API key");
      } else if (response.status === 404) {
        throw new Error("City not found. Please check the city name and try again");
      } else {
        throw new Error("Error fetching weather data");
      }
    }

    // Parse the response as JSON
    const data = await response.json();

    // Extract and format the relevant weather information
    const weatherData: WeatherData = {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].main,
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000), // Convert to km
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      coords: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      windDirection: data.wind.deg,
      cloudiness: data.clouds.all
    };

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

/**
 * Get the weather background class based on the weather condition
 * @param condition - The weather condition
 * @returns string - The CSS class for the background
 */
export const getWeatherBackgroundClass = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case "clear":
      return "from-blue-400 to-yellow-300"; // Sunny
    case "clouds":
      if (condition === "few clouds") {
        return "from-blue-400 to-blue-200"; // Few clouds
      }
      return "from-blue-500 to-blue-300"; // Cloudy
    case "rain":
      return "from-blue-700 to-blue-400"; // Rain
    case "drizzle":
      return "from-blue-500 to-blue-300"; // Drizzle
    case "thunderstorm":
      return "from-purple-900 to-blue-700"; // Thunderstorm
    case "snow":
      return "from-blue-100 to-gray-100"; // Snow
    case "mist":
    case "fog":
    case "haze":
      return "from-gray-300 to-gray-200"; // Misty/Foggy
    default:
      return "from-blue-500 to-blue-300"; // Default
  }
};

/**
 * Fetch 5-day forecast data for a given location
 * (Free plan API endpoint)
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @returns Promise with the forecast data
 */
export const fetchForecastData = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Error fetching forecast data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
};

/**
 * Get wind direction as a cardinal direction
 * @param degrees - Wind direction in degrees
 * @returns string - Cardinal direction (N, NE, E, etc.)
 */
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Format time from Unix timestamp
 * @param timestamp - Unix timestamp
 * @param timezone - Timezone offset in seconds
 * @returns string - Formatted time (HH:MM AM/PM)
 */
export const formatTime = (timestamp: number, timezone: number): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

/**
 * Group forecast data by day - works with free plan API response
 * @param forecastData - Raw forecast data from API
 * @returns Array of daily forecasts with summarized information
 */
export const groupForecastByDay = (forecastData: any) => {
  const groupedByDay: { [key: string]: any[] } = {};
  
  // Group forecast items by day
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0];
    
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    
    groupedByDay[day].push(item);
  });
  
  // Process each day's data to get min/max temp and dominant condition
  return Object.keys(groupedByDay).map(day => {
    const items = groupedByDay[day];
    
    // Find min and max temperatures
    const temperatures = items.map(item => item.main.temp);
    const minTemp = Math.round(Math.min(...temperatures));
    const maxTemp = Math.round(Math.max(...temperatures));
    
    // Find the most common weather condition
    const conditions = items.map(item => item.weather[0].main);
    const conditionCounts: Record<string, number> = {};
    conditions.forEach(condition => {
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });
    
    const dominantCondition = Object.entries(conditionCounts).reduce(
      (max, [condition, count]) => count > max.count ? { condition, count } : max,
      { condition: '', count: 0 }
    ).condition;
    
    // Get icon from noon forecast if available, otherwise use first icon
    const noonForecast = items.find(item => {
      const hour = new Date(item.dt * 1000).getHours();
      return hour >= 11 && hour <= 13;
    });
    
    const icon = noonForecast 
      ? noonForecast.weather[0].icon 
      : items[0].weather[0].icon;
    
    // Format the date
    const dateObj = new Date(day);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    return {
      date: formattedDate,
      rawDate: day,
      minTemp,
      maxTemp,
      condition: dominantCondition,
      icon,
      hourlyData: items
    };
  }).slice(0, 5); // Limit to 5 days
};
