
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import DataSourceIndicator from '@/components/shared/DataSourceIndicator';
import { DataSource, dataSources } from '@/lib/mock-data';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  badgeText: string;
  currentDataSource?: DataSource;
  onSourceChange?: (source: DataSource) => void;
  className?: string;
}

const PageHeader = ({
  icon: Icon,
  title,
  subtitle,
  badgeText,
  currentDataSource = dataSources[0], // Provide default value
  onSourceChange,
  className
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

  return (
    <motion.div 
      className={cn("w-full max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4", className)}
      variants={itemAnimation}
    >
      <div>
        <div className="pill bg-primary/10 text-primary mb-2 font-medium px-3 py-1.5 rounded-full inline-flex items-center">
          <Icon className="w-3.5 h-3.5 mr-1.5" />
          {badgeText}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {/* Only show data source selector if currentDataSource is provided */}
      {currentDataSource && onSourceChange && (
        <DataSourceIndicator 
          currentSource={currentDataSource}
          onSourceChange={onSourceChange}
        />
      )}
    </motion.div>
  );
};

export default PageHeader;
