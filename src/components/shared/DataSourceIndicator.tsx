
import { useState } from 'react';
import { ChevronDown, Database, Code, Cloud, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dataSources, DataSource } from '@/lib/mock-data';

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
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className={cn("relative inline-block", className)}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-flex items-center gap-1.5"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {getIcon(selected.type)}
          <span>{selected.name}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {isOpen && (
          <div 
            className="absolute z-10 mt-1 w-40 max-h-60 overflow-auto rounded-md glass-panel shadow-lg py-1"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="py-1">
              {dataSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSourceSelect(source)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors",
                    "hover:bg-primary/5",
                    selected.id === source.id 
                      ? "text-primary font-medium" 
                      : "text-foreground"
                  )}
                >
                  {getIcon(source.type)}
                  {source.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="data-source-pill inline-flex items-center gap-1.5 group transition-all duration-300 pr-2.5"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center gap-1.5">
          {getIcon(selected.type)}
          <span>{selected.name}</span>
        </span>
        <ChevronDown className={cn(
          "w-3.5 h-3.5 transition-transform duration-200",
          isOpen ? "rotate-180" : "rotate-0"
        )} />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 mt-1 w-48 max-h-60 overflow-auto rounded-md glass-panel shadow-lg py-1"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-1">
            {dataSources.map((source) => (
              <button
                key={source.id}
                onClick={() => handleSourceSelect(source)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors",
                  "hover:bg-primary/5",
                  selected.id === source.id 
                    ? "text-primary font-medium" 
                    : "text-foreground"
                )}
              >
                {getIcon(source.type)}
                {source.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSourceIndicator;
