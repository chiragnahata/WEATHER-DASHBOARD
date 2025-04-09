
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, ArrowUp, ArrowDown, Droplets } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/useTheme";

interface ForecastDisplayProps {
  forecastData: any[];
  isLoading: boolean;
  isCelsius: boolean;
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({ 
  forecastData, 
  isLoading, 
  isCelsius 
}) => {
  const { theme } = useTheme();
  
  // Convert temperature from Celsius to Fahrenheit if needed
  const convertTemp = (celsius: number) => {
    return isCelsius ? celsius : Math.round((celsius * 9/5) + 32);
  };

  // Temperature unit symbol
  const tempUnit = isCelsius ? '°C' : '°F';

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl mx-auto mt-8"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className={`${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/30'} backdrop-blur-md border ${theme === 'dark' ? 'border-gray-700/50' : 'border-white/20'} h-32`}>
              <CardContent className="flex items-center justify-center h-full">
                <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700/70' : 'bg-white/40'} rounded w-3/4 animate-pulse`}></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    );
  }

  if (!forecastData || forecastData.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <h2 className={`text-xl font-semibold mb-3 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>5-Day Forecast</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {forecastData.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <Card className={`${theme === 'dark' ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/50 border-white/30'} backdrop-blur-md shadow-md h-full`}>
              <CardContent className="p-3 flex flex-col items-center">
                <p className={`font-medium text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{day.date}</p>
                
                <div className={`mb-1 relative w-14 h-14 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/70'} rounded-full flex items-center justify-center`}>
                  <img 
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                    alt={day.condition}
                    className="w-full h-full drop-shadow-md"
                  />
                </div>
                
                <Badge variant={theme === 'dark' ? 'outline' : 'secondary'} className={`mb-2 ${theme === 'dark' ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-800'} text-xs ${theme === 'dark' ? 'border-blue-800' : 'border-blue-200'}`}>
                  {day.condition}
                </Badge>
                
                <div className="flex justify-between w-full items-center">
                  <div className="flex items-center">
                    <ArrowDown size={14} className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mr-1`} />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>{convertTemp(day.minTemp)}{tempUnit}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <ArrowUp size={14} className={`${theme === 'dark' ? 'text-red-400' : 'text-red-500'} mr-1`} />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>{convertTemp(day.maxTemp)}{tempUnit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ForecastDisplay;
