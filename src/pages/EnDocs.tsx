
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, SortDesc, SortAsc } from 'lucide-react';
import DataSourceIndicator from '@/components/shared/DataSourceIndicator';
import DataVisualizer from '@/components/ui/DataVisualizer';
import ChatInput from '@/components/ui/ChatInput';
import { documentData, DataSource, dataSources, textResponses } from '@/lib/mock-data';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const EnDocs = () => {
  const [currentDataSource, setCurrentDataSource] = useState<DataSource>(dataSources[3]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const handleSendQuery = (message: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Documents processed",
        description: "Your document query has been processed.",
        duration: 3000,
      });
    }, 1500);
  };

  // Filter and sort documents
  const filteredDocs = documentData.filter(doc => 
    searchQuery === '' || 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    const dateA = new Date(a.created).getTime();
    const dateB = new Date(b.created).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

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

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get document icon based on type
  const getDocIcon = (type: string) => {
    switch(type) {
      case 'PDF':
        return <span className="text-red-600">PDF</span>;
      case 'DOCX':
        return <span className="text-blue-600">DOC</span>;
      case 'XLSX':
        return <span className="text-green-600">XLS</span>;
      case 'PPTX':
        return <span className="text-orange-600">PPT</span>;
      default:
        return <span>{type}</span>;
    }
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
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            EnDocs
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Document Analysis
          </h1>
          <p className="text-muted-foreground">
            Search, analyze and extract insights from your documents
          </p>
        </div>

        <DataSourceIndicator 
          currentSource={currentDataSource}
          onSourceChange={setCurrentDataSource}
        />
      </motion.div>

      <motion.div variants={itemAnimation}>
        <div className="glass-panel p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="w-3.5 h-3.5" />
                ) : (
                  <SortDesc className="w-3.5 h-3.5" />
                )}
                <span>Sort</span>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead className="w-[300px]">Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead className="text-right">Date Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDocs.map((doc) => (
                  <TableRow 
                    key={doc.id} 
                    className="transition-colors hover:bg-muted/30 cursor-pointer"
                    onClick={() => {
                      toast({
                        title: "Document selected",
                        description: `You selected "${doc.title}"`,
                        duration: 3000
                      });
                    }}
                  >
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{getDocIcon(doc.type)}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{doc.pages}</TableCell>
                    <TableCell className="text-right">{formatDate(doc.created)}</TableCell>
                  </TableRow>
                ))}
                {sortedDocs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No documents found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        variants={itemAnimation}
      >
        <DataVisualizer 
          title="Document Analysis"
          textContent={textResponses[1]}
        />
        
        <DataVisualizer 
          title="Key Insights"
          data={documentData.map(doc => ({
            city: doc.title,
            sales: doc.pages * 100,
            growth: doc.pages,
          }))}
        />
      </motion.div>

      <motion.div 
        className="mt-6 w-full max-w-2xl mx-auto"
        variants={itemAnimation}
      >
        <ChatInput 
          onSend={handleSendQuery}
          placeholder="Ask questions about your documents..."
          showSuggestions={true}
          className={isLoading ? "opacity-70 pointer-events-none" : ""}
        />
      </motion.div>
    </motion.div>
  );
};

export default EnDocs;
