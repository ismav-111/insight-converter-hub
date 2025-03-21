
import { useState, useEffect, useRef } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { LayoutGrid, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table as TableIcon, FileText, Copy, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { generateTimeSeriesData, citySalesData } from '@/lib/mock-data';

type VisualizationType = 'bar' | 'line' | 'pie' | 'table' | 'text';

interface DataVisualizerProps {
  data?: any[];
  textContent?: string;
  title?: string;
  className?: string;
}

const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#7ED321', '#BD10E0', '#9013FE'];

const DataVisualizer = ({ 
  data = citySalesData, 
  textContent = '', 
  title = 'Sales by City',
  className 
}: DataVisualizerProps) => {
  const [visType, setVisType] = useState<VisualizationType>('bar');
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setTimeSeriesData(generateTimeSeriesData(30));
  }, []);

  const handleCopyToClipboard = () => {
    if (visType === 'text' && textContent) {
      navigator.clipboard.writeText(textContent);
      toast({
        title: "Copied to clipboard",
        description: "The text content has been copied to your clipboard.",
        duration: 3000,
      });
    } else if (data) {
      const jsonStr = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(jsonStr);
      toast({
        title: "Copied to clipboard",
        description: "The data has been copied to your clipboard as JSON.",
        duration: 3000,
      });
    }
  };

  const renderVisualization = () => {
    switch(visType) {
      case 'bar':
        return (
          <div className="w-full h-[350px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="city" 
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 10 }}
                  height={60}
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  name="Sales" 
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'line':
        return (
          <div className="w-full h-[350px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeSeriesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Sales Trend"
                  stroke="#4A90E2"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'pie':
        return (
          <div className="w-full h-[350px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.slice(0, 7)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="sales"
                  nameKey="city"
                >
                  {data.slice(0, 7).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'table':
        return (
          <div className="w-full overflow-x-auto pt-2">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={i} className="transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">{row.city}</TableCell>
                    <TableCell className="text-right">${row.sales.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "inline-block px-2 py-0.5 rounded text-xs font-medium",
                        row.growth > 10 ? "bg-green-100 text-green-800" : 
                        row.growth > 5 ? "bg-blue-100 text-blue-800" : 
                        "bg-amber-100 text-amber-800"
                      )}>
                        {row.growth}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      
      case 'text':
        return (
          <div className="w-full pt-2">
            <div className="bg-muted/20 p-4 rounded-lg text-left">
              {textContent ? (
                <p className="whitespace-pre-line">{textContent}</p>
              ) : (
                <p>
                  Based on the sales data analyzed from the last quarter, New York continues to be our strongest market with $1.2M in sales, followed by San Francisco with $950K. 
                  The most significant growth was observed in Austin at 15.3%, suggesting we should consider expanding our presence there. 
                  Miami and New York also showed strong growth at 11.1% and 12.5% respectively.
                </p>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const visualizationOptions = [
    { type: 'bar', icon: <BarChart3 className="w-4 h-4" />, label: 'Bar Chart' },
    { type: 'line', icon: <LineChartIcon className="w-4 h-4" />, label: 'Line Chart' },
    { type: 'pie', icon: <PieChartIcon className="w-4 h-4" />, label: 'Pie Chart' },
    { type: 'table', icon: <TableIcon className="w-4 h-4" />, label: 'Table' },
    { type: 'text', icon: <FileText className="w-4 h-4" />, label: 'Text' },
  ];

  return (
    <div 
      ref={containerRef}
      className={cn(
        "glass-panel p-4 md:p-6 w-full transition-all duration-300",
        className
      )}
    >
      <header className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <h3 className="font-medium tracking-tight">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg bg-muted/30 p-1">
            {visualizationOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setVisType(option.type as VisualizationType)}
                className={cn(
                  "flex items-center justify-center rounded-md p-1.5 relative",
                  "transition-all duration-200 hover:text-primary",
                  visType === option.type 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
                title={option.label}
              >
                {option.icon}
                {visType === option.type && (
                  <motion.div
                    layoutId="visualization-tab-indicator"
                    className="absolute inset-0 bg-white dark:bg-gray-800 rounded-md -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyToClipboard}
            className="w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            title="About this data"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="py-4">
        {renderVisualization()}
      </div>

      <div className="pt-3 border-t border-border/40 text-xs text-right text-muted-foreground">
        Last updated: 12:00 AM
      </div>
    </div>
  );
};

export default DataVisualizer;
