
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react";

interface ErrorMessageProps {
  message: string;
}

/**
 * Component to display error messages with animations
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="max-w-md mx-auto mt-4 relative"
      >
        <Alert variant="destructive" className="backdrop-blur-sm bg-red-50/80 border-red-200 shadow-md">
          <AlertCircle className="h-4 w-4 animate-pulse" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          <button 
            onClick={() => setVisible(false)} 
            className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorMessage;
