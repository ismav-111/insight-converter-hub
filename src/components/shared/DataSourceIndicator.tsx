
import { useState } from 'react';
import { ChevronDown, Database, Code, Cloud, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dataSources, DataSource } from '@/lib/mock-data';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface DataSourceIndicatorProps {
  currentSource?: DataSource;
  onSourceChange?: (source: DataSource) => void;
  className?: string;
  compact?: boolean;
}

const DataSourceIndicator = ({ 
  currentSource,
  onSourceChange,
  className,
  compact = false
}: DataSourceIndicatorProps) => {
  const selected = currentSource || dataSources[0];

  const getIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'database': return <Database className="w-3.5 h-3.5" />;
      case 'api': return <Code className="w-3.5 h-3.5" />;
      case 'cloud': return <Cloud className="w-3.5 h-3.5" />;
      case 'file': return <File className="w-3.5 h-3.5" />;
    }
  };

  const handleSourceSelect = (source: DataSource) => {
    if (onSourceChange) {
      onSourceChange(source);
    }
  };

  if (!onSourceChange) {
    // If no change handler, just display the current source without dropdown
    return (
      <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary", 
        compact ? "text-xs" : "text-sm",
        className
      )}>
        {getIcon(selected.type)}
        <span>{selected.name}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
        "border border-primary/20",
        compact ? "text-xs" : "text-sm",
        className
      )}>
        {getIcon(selected.type)}
        <span>{selected.name}</span>
        <ChevronDown className="w-3.5 h-3.5 ml-1" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {dataSources.map((source) => (
          <DropdownMenuItem
            key={source.id}
            className={cn(
              "flex items-center gap-2",
              selected.id === source.id && "bg-primary/10 font-medium text-primary"
            )}
            onClick={() => handleSourceSelect(source)}
          >
            {getIcon(source.type)}
            {source.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataSourceIndicator;
