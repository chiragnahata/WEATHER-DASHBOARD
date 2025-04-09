
import React, { useState, useEffect } from 'react';
import { fetchWeatherData, fetchForecastData, WeatherData, groupForecastByDay } from '@/services/weatherService';
import SearchBar from '@/components/SearchBar';
import WeatherDisplay from '@/components/WeatherDisplay';
import ForecastDisplay from '@/components/ForecastDisplay';
import WeatherDetails from '@/components/WeatherDetails';
import ErrorMessage from '@/components/ErrorMessage';
import ThemeToggle from '@/components/ThemeToggle';
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/Footer';
import { Sparkles, MapPinned, History, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Main Weather Application component with enhanced features
 */
const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { theme } = useTheme();

  // Load last searched city from localStorage on component mount
  useEffect(() => {
    const lastCity = localStorage.getItem('lastSearchedCity');
    const savedHistory = localStorage.getItem('searchHistory');
    
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing search history:", e);
      }
    }
    
    if (lastCity) {
      handleSearch(lastCity);
    }
    
    // Load temperature unit preference
    const tempUnitPref = localStorage.getItem('tempUnit');
    if (tempUnitPref) {
      setIsCelsius(tempUnitPref === 'celsius');
    }
  }, []);

  // Save temperature unit preference when it changes
  useEffect(() => {
    localStorage.setItem('tempUnit', isCelsius ? 'celsius' : 'fahrenheit');
  }, [isCelsius]);

  /**
   * Handle search functionality and store searched city
   * @param city - The city name to search for
   */
  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch current weather data
      const data = await fetchWeatherData(city);
      setWeatherData(data);
      
      // Fetch forecast data using coordinates
      const forecastResponse = await fetchForecastData(data.coords.lat, data.coords.lon);
      const groupedForecast = groupForecastByDay(forecastResponse);
      setForecastData(groupedForecast);
      
      // Save the city to localStorage for future visits
      localStorage.setItem('lastSearchedCity', city);
      
      // Update search history
      const updatedHistory = [city, ...searchHistory.filter(item => item !== city)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      
      toast({
        title: "Weather updated",
        description: `Latest weather data for ${data.city} loaded successfully`,
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle temperature unit toggle
   */
  const handleTemperatureUnitChange = (value: boolean) => {
    setIsCelsius(value);
  };

  return (
    <div className={`container px-4 py-8 mx-auto min-h-screen relative overflow-hidden ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
      {/* Theme toggle positioned at the top right */}
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>
      
      {/* Background gradient animation */}
      <motion.div
        className={`absolute inset-0 -z-10 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
            : 'bg-gradient-to-br from-blue-100 to-purple-100'
        }`}
        style={{
          backgroundImage: weatherData ? 
                          `linear-gradient(to bottom right, 
                          ${theme === 'dark' ? (
                            weatherData.condition === 'Clear' ? 'rgb(146, 64, 14), rgb(113, 63, 18)' : 
                            weatherData.condition === 'Clouds' ? 'rgb(71, 85, 105), rgb(51, 65, 85)' :
                            weatherData.condition === 'Rain' ? 'rgb(30, 58, 138), rgb(30, 64, 175)' :
                            weatherData.condition === 'Snow' ? 'rgb(59, 130, 246), rgb(29, 78, 216)' :
                            'rgb(30, 41, 59), rgb(15, 23, 42)'
                          ) : (
                            weatherData.condition === 'Clear' ? 'rgb(254, 240, 138), rgb(251, 207, 232)' : 
                            weatherData.condition === 'Clouds' ? 'rgb(209, 213, 219), rgb(209, 213, 219)' :
                            weatherData.condition === 'Rain' ? 'rgb(165, 180, 252), rgb(104, 117, 245)' :
                            weatherData.condition === 'Snow' ? 'rgb(224, 242, 254), rgb(186, 230, 253)' :
                            'rgb(219, 234, 254), rgb(243, 232, 255)'
                          )})` : 
                          theme === 'dark' ?
                          'linear-gradient(to bottom right, rgb(30, 41, 59), rgb(15, 23, 42))' :
                          'linear-gradient(to bottom right, rgb(219, 234, 254), rgb(243, 232, 255))'
        }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Abstract shapes in background */}
      <motion.div 
        className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-slate-700 to-slate-800 opacity-20' 
            : 'bg-gradient-to-r from-pink-200 to-blue-200 opacity-30'
        } blur-3xl`}
        animate={{ 
          x: [0, 10, -10, 0],
          y: [0, -10, 10, 0],
          scale: [1, 1.05, 0.95, 1]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className={`absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-indigo-900 to-purple-900 opacity-10' 
            : 'bg-gradient-to-r from-yellow-200 to-green-200 opacity-20'
        } blur-3xl`}
        animate={{ 
          x: [0, -15, 15, 0],
          y: [0, 15, -15, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-2 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        } bg-clip-text text-transparent drop-shadow-sm`}>
          Weather Dashboard
        </h1>
        <div className="flex items-center justify-center gap-2 text-center mb-8">
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Get real-time weather information for any city</p>
          <Sparkles className="text-amber-500 h-4 w-4 animate-pulse" />
        </div>
      </motion.div>
      
      <SearchBar onSearch={handleSearch} isLoading={isLoading} searchHistory={searchHistory} />
      
      <AnimatePresence>
        {error && <ErrorMessage message={error} />}
      </AnimatePresence>
      
      <WeatherDisplay 
        weatherData={weatherData} 
        isLoading={isLoading} 
        isCelsius={isCelsius}
        onTemperatureUnitChange={handleTemperatureUnitChange}
      />
      
      {weatherData && (
        <>
          <ForecastDisplay 
            forecastData={forecastData || []} 
            isLoading={isLoading} 
            isCelsius={isCelsius} 
          />
          <WeatherDetails weatherData={weatherData} />
        </>
      )}
      
      <AnimatePresence>
        {!weatherData && !isLoading && !error && (
          <motion.div 
            className={`text-center mt-12 backdrop-blur-sm ${
              theme === 'dark' ? 'bg-gray-800/30 text-gray-300' : 'bg-white/30 text-gray-600'
            } p-8 rounded-lg max-w-md mx-auto`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-lg font-medium mb-4">Welcome to your Weather Dashboard</p>
            <p>Enter a city name above to get the current weather information</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default WeatherApp;
