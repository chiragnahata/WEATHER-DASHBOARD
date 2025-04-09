
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherData, getWeatherBackgroundClass } from "@/services/weatherService";
import { Wind, Droplets, Thermometer, Calendar, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface WeatherDisplayProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  isCelsius: boolean;
  onTemperatureUnitChange: (value: boolean) => void;
}

/**
 * Component to display weather information with enhanced UI
 */
const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weatherData, 
  isLoading, 
  isCelsius, 
  onTemperatureUnitChange 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFullInfo, setShowFullInfo] = useState(false);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Show full info after a short delay when weather data loads
  useEffect(() => {
    if (weatherData) {
      const timer = setTimeout(() => {
        setShowFullInfo(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowFullInfo(false);
    }
  }, [weatherData]);
  
  // Format date as "Day, Month Date, Year"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentTime);
  
  // Format time as "HH:MM AM/PM"
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(currentTime);

  // Convert temperature from Celsius to Fahrenheit
  const convertTemp = (celsius: number) => {
    return isCelsius ? celsius : Math.round((celsius * 9/5) + 32);
  };

  // Temperature unit symbol
  const tempUnit = isCelsius ? '°C' : '°F';

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto mt-8"
      >
        <Card className="backdrop-blur-lg bg-white/40 border border-white/30 shadow-lg overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-8 w-3/4 bg-white/40" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center">
                <Skeleton className="h-32 w-32 rounded-full bg-white/40" />
              </div>
              <Skeleton className="h-10 w-full bg-white/40" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-20 w-full bg-white/40" />
                <Skeleton className="h-20 w-full bg-white/40" />
                <Skeleton className="h-20 w-full bg-white/40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const backgroundClass = getWeatherBackgroundClass(weatherData.condition);
  
  // Configure animations for weather display elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={weatherData.city}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-md mx-auto mt-4"
      >
        <Card className="overflow-hidden backdrop-blur-lg bg-white/40 border border-white/40 shadow-xl relative">
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="backdrop-blur-md bg-blue-100 text-blue-800 shadow-sm border border-blue-200 font-medium">
              {weatherData.condition}
            </Badge>
          </div>
          
          <CardHeader className={`bg-gradient-to-r ${backgroundClass} text-white pb-2`}>
            <CardTitle className="text-2xl flex items-center justify-between">
              <motion.div 
                className="flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <MapPin size={18} className="mr-2" />
                <div>
                  {weatherData.city}, {weatherData.country}
                </div>
              </motion.div>
              <motion.div 
                className="text-4xl font-bold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {convertTemp(weatherData.temperature)}{tempUnit}
              </motion.div>
            </CardTitle>
            <div className="flex items-center justify-between mt-2 text-sm text-white/90">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Calendar size={14} className="mr-1" />
                {formattedDate}
              </motion.div>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Clock size={14} className="mr-1" />
                {formattedTime}
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 backdrop-blur-sm">
            <motion.div 
              className="flex justify-end mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <Label htmlFor="temp-unit" className="text-xs font-medium">°C</Label>
                <Switch 
                  id="temp-unit" 
                  checked={!isCelsius} 
                  onCheckedChange={(checked) => onTemperatureUnitChange(!checked)} 
                />
                <Label htmlFor="temp-unit" className="text-xs font-medium">°F</Label>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <motion.div 
                className="w-32 h-32 mb-2 relative bg-white/70 rounded-full p-2 shadow-md"
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  y: [0, -5, 0, -5, 0],
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.img 
                  src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`}
                  alt={weatherData.description}
                  className="w-full h-full filter drop-shadow-lg"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </motion.div>
              <motion.div 
                className="text-xl font-medium capitalize"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {weatherData.description}
              </motion.div>
              <motion.div 
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Feels like: {convertTemp(weatherData.feelsLike)}{tempUnit}
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {showFullInfo && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-3 gap-3 mt-6"
                >
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-white/50 shadow-sm"
                  >
                    <Thermometer size={24} className="text-blue-500 mb-1" />
                    <div className="text-xs text-gray-700">Temperature</div>
                    <div className="font-medium">{convertTemp(weatherData.temperature)}{tempUnit}</div>
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-white/50 shadow-sm"
                  >
                    <Droplets size={24} className="text-blue-500 mb-1" />
                    <div className="text-xs text-gray-700">Humidity</div>
                    <div className="font-medium">{weatherData.humidity}%</div>
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-white/50 shadow-sm"
                  >
                    <Wind size={24} className="text-blue-500 mb-1" />
                    <div className="text-xs text-gray-700">Wind</div>
                    <div className="font-medium">{weatherData.windSpeed} m/s</div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherDisplay;
