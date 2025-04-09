
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Clock, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  searchHistory?: string[];
}

/**
 * SearchBar Component with enhanced features
 */
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, searchHistory = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (searchTerm.trim() === "") return;
    
    onSearch(searchTerm);
    setIsOpen(false);
  };

  const handleHistoryItemClick = (city: string) => {
    setSearchTerm(city);
    onSearch(city);
    setIsOpen(false);
  };

  const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex">
          <div className="relative flex-grow">
            <Popover open={isOpen && searchHistory.length > 0} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <div className="w-full relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for a city..."
                    className="pl-10 pr-4 py-6 rounded-l-lg border border-r-0 border-white/50 backdrop-blur-md bg-white/40 placeholder:text-gray-500 focus-visible:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchHistory.length > 0 && setIsOpen(true)}
                  />
                </div>
              </PopoverTrigger>
              
              <PopoverContent className="w-[300px] p-0" align="start">
                <div className="py-2 px-1">
                  <div className="flex items-center justify-between px-3 pb-2 border-b">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      Recent Searches
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-gray-500"
                      onClick={clearHistory}
                    >
                      Clear
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <AnimatePresence>
                      {searchHistory.map((city, index) => (
                        <motion.div
                          key={city + index}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <button
                            type="button"
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                            onClick={() => handleHistoryItemClick(city)}
                          >
                            <Clock size={14} className="mr-2 text-gray-400" />
                            {city}
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-r-lg flex items-center justify-center min-w-[100px] border border-blue-600"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Search
                <Search className="ml-2 h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default SearchBar;
