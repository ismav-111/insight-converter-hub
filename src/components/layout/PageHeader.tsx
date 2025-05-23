
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import DataSourceIndicator from '@/components/shared/DataSourceIndicator';
import { DataSource, dataSources } from '@/lib/mock-data';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  badgeText?: string;
  currentDataSource?: DataSource;
  onSourceChange?: (source: DataSource) => void;
  className?: string;
  minimal?: boolean;
}

const PageHeader = ({
  icon: Icon,
  title,
  subtitle,
  badgeText,
  currentDataSource = dataSources[0],
  onSourceChange,
  className,
  minimal = true // Set minimal to true by default
}: PageHeaderProps) => {
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

  if (minimal) {
    return (
      <motion.div 
        className={cn("w-full max-w-6xl mx-auto mb-6", className)}
        variants={itemAnimation}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <Icon className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {badgeText && (
              <span className="hidden md:inline-block pill bg-primary/10 text-primary font-medium px-2 py-1 text-sm rounded-full">
                {badgeText}
              </span>
            )}
          </div>

          {currentDataSource && onSourceChange && (
            <DataSourceIndicator 
              currentSource={currentDataSource}
              onSourceChange={onSourceChange}
            />
          )}
        </div>
      </motion.div>
    );
  }

  // Original non-minimal design
  return (
    <motion.div 
      className={cn("w-full max-w-6xl mx-auto mb-8", className)}
      variants={itemAnimation}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 text-primary rounded-full p-2">
                <Icon className="w-5 h-5" />
              </div>
              {badgeText && (
                <span className="pill bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-full">
                  {badgeText}
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          {currentDataSource && onSourceChange && (
            <DataSourceIndicator 
              currentSource={currentDataSource}
              onSourceChange={onSourceChange}
              className="mt-2 md:mt-0"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;
