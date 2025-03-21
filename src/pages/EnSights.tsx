
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout, CircleUser, Cpu, Database } from 'lucide-react';
import DataSourceIndicator from '@/components/shared/DataSourceIndicator';
import DataVisualizer from '@/components/ui/DataVisualizer';
import ChatInput from '@/components/ui/ChatInput';
import { citySalesData, DataSource, dataSources, textResponses } from '@/lib/mock-data';
import { useToast } from '@/components/ui/use-toast';

const EnSights = () => {
  const [currentDataSource, setCurrentDataSource] = useState<DataSource>(dataSources[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const handleSendQuery = (message: string) => {
    setQuery(message);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Query processed",
        description: "We've processed your query and updated the visualization.",
        duration: 3000,
      });
    }, 1500);
  };

  useEffect(() => {
    // Animation for initial load
    const timer = setTimeout(() => {
      document.documentElement.style.setProperty('--page-loaded', 'true');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const getTextContent = () => {
    // Return a different text response based on the query
    if (query.toLowerCase().includes('growth')) {
      return textResponses[2];
    } else if (query.toLowerCase().includes('market') || query.toLowerCase().includes('trend')) {
      return textResponses[3];
    } else if (query.toLowerCase().includes('inventory')) {
      return textResponses[4];
    } else if (query.toLowerCase().includes('customer')) {
      return textResponses[1];
    }
    return textResponses[0];
  };

  return (
    <motion.div 
      className="pt-20 px-4 md:px-8 pb-8 max-w-7xl mx-auto"
      initial="hidden"
      animate="show"
      variants={containerAnimation}
    >
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        variants={itemAnimation}
      >
        <div>
          <div className="pill bg-primary/10 text-primary mb-2 font-medium">
            <Layout className="w-3.5 h-3.5 mr-1.5" />
            EnSights
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Data Visualization & Insights
          </h1>
          <p className="text-muted-foreground">
            Visualize your data with advanced analytics and get actionable insights
          </p>
        </div>

        <DataSourceIndicator 
          currentSource={currentDataSource}
          onSourceChange={setCurrentDataSource}
        />
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        variants={itemAnimation}
      >
        <DataVisualizer 
          data={citySalesData}
          title="Sales by City"
        />
        
        <DataVisualizer 
          data={citySalesData}
          title="Growth Analysis"
          textContent={getTextContent()}
        />
      </motion.div>

      <motion.div 
        className="mt-6 w-full max-w-2xl mx-auto"
        variants={itemAnimation}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Cpu className="w-3.5 h-3.5" />
            <span>Suggested: "Could you give the barchart of the above data"</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs">
            <span className="pill bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <CircleUser className="w-3 h-3 mr-1" />
              <span>You</span>
            </span>
            <span className="pill bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
              <Database className="w-3 h-3 mr-1" />
              <span>System</span>
            </span>
          </div>
        </div>
        
        <ChatInput 
          onSend={handleSendQuery}
          placeholder="Ask something about your data..."
          showSuggestions={true}
          className={isLoading ? "opacity-70 pointer-events-none" : ""}
        />
      </motion.div>
    </motion.div>
  );
};

export default EnSights;
