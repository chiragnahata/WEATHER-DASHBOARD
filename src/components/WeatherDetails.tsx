
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Cloud, 
  Navigation, 
  Sunrise, 
  Sunset,
  MapPin
} from 'lucide-react';
import { WeatherData, formatTime, getWindDirection } from '@/services/weatherService';
import { useTheme } from '@/hooks/useTheme';

interface WeatherDetailsProps {
  weatherData: WeatherData;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weatherData }) => {
  const { theme } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
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

  const detailItems = [
    {
      icon: <Droplets size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />,
      title: "Humidity",
      value: `${weatherData.humidity}%`
    },
    {
      icon: <Wind size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />,
      title: "Wind Speed",
      value: `${weatherData.windSpeed} m/s`
    },
    {
      icon: <Navigation size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />,
      title: "Wind Direction",
      value: getWindDirection(weatherData.windDirection)
    },
    {
      icon: <Gauge size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />,
      title: "Pressure",
      value: `${weatherData.pressure} hPa`
    },
    {
      icon: <Eye size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />,
      title: "Visibility",
      value: `${weatherData.visibility} km`
    },
    {
      icon: <Cloud size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />,
      title: "Cloudiness",
      value: `${weatherData.cloudiness}%`
    },
    {
      icon: <Sunrise size={20} className="text-amber-500" />,
      title: "Sunrise",
      value: formatTime(weatherData.sunrise, weatherData.timezone)
    },
    {
      icon: <Sunset size={20} className="text-orange-500" />,
      title: "Sunset",
      value: formatTime(weatherData.sunset, weatherData.timezone)
    }
  ];

  return (
    <motion.div 
      className="max-w-2xl mx-auto mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className={`text-xl font-semibold mb-3 text-center ${theme === 'dark' ? 'text-gray-100' : ''}`}>Weather Details</h2>
      <Card className={`${theme === 'dark' ? 'backdrop-blur-lg bg-gray-800/30 border-gray-700/30' : 'backdrop-blur-lg bg-white/30 border-white/30'}`}>
        <CardContent className="p-4">
          <motion.div 
            className="flex items-center mb-4 justify-center"
            variants={itemVariants}
          >
            <MapPin className="text-red-500 mr-2" size={16} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>
              {weatherData.coords.lat.toFixed(2)}° N, {weatherData.coords.lon.toFixed(2)}° E
            </span>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {detailItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50' 
                    : 'bg-white/40 backdrop-blur-sm border-white/50'
                } shadow-sm border`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="mb-1">{item.icon}</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.title}</div>
                <div className={`font-medium text-sm ${theme === 'dark' ? 'text-gray-200' : ''}`}>{item.value}</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherDetails;
