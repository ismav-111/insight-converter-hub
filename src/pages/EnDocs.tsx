
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, SortDesc, SortAsc, Bot, User, Clock } from 'lucide-react';
import DataSourceIndicator from '@/components/shared/DataSourceIndicator';
import DataVisualizer from '@/components/ui/DataVisualizer';
import ChatInput from '@/components/ui/ChatInput';
import { documentData, DataSource, dataSources, textResponses, citySalesData } from '@/lib/mock-data';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showGraph?: boolean;
}

const EnDocs = () => {
  const [currentDataSource, setCurrentDataSource] = useState<DataSource>(dataSources[3]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm the EnDocs assistant. Ask me about your documents or data analysis needs.",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const handleSendQuery = (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    
    // Simulate API call
    setTimeout(() => {
      // Determine if this query should show a graph
      const shouldShowGraph = message.toLowerCase().includes('chart') || 
                             message.toLowerCase().includes('graph') || 
                             message.toLowerCase().includes('visualization') ||
                             message.toLowerCase().includes('data') ||
                             Math.random() > 0.5; // 50% chance to show graph for demo purposes
      
      // Pick a random response
      const randomIndex = Math.floor(Math.random() * textResponses.length);
      const responseText = textResponses[randomIndex];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: 'bot',
        timestamp: new Date(),
        showGraph: shouldShowGraph
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setIsTyping(false);
      
      toast({
        title: "Response generated",
        description: "We've processed your query and updated the visualization.",
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

  // Format time for chat messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

      {/* Chat Session with Documents */}
      <motion.div variants={itemAnimation} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 glass-panel p-4 md:p-6 flex flex-col h-[500px]">
          <h3 className="font-medium tracking-tight mb-4 flex items-center">
            <Bot className="w-4 h-4 mr-2 text-primary" />
            Chat Session
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 mb-4">
            <div className="space-y-6 pb-2">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <div
                    className={cn(
                      "flex w-full",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "flex items-start max-w-[90%]",
                      message.sender === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        message.sender === 'user' ? "ml-2" : "mr-2"
                      )}>
                        {message.sender === 'user' ? (
                          <Avatar className="h-8 w-8 border border-border">
                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-8 w-8 border border-border">
                            <AvatarFallback className="bg-violet-100 text-violet-800 text-xs">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      
                      <div className={cn(
                        "rounded-lg px-4 py-3",
                        message.sender === 'user' 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted/50"
                      )}>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="text-xs font-medium">
                            {message.sender === 'user' ? 'You' : 'EnDocs AI'}
                          </span>
                          <span className="flex items-center text-xs opacity-70">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="whitespace-pre-line text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                  
                  {message.showGraph && (
                    <div className="pl-10 pr-10">
                      <DataVisualizer 
                        data={citySalesData}
                        title="Document Analysis Visualization"
                        className="bg-muted/10"
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="flex items-start max-w-[90%]">
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarFallback className="bg-violet-100 text-violet-800 text-xs">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-4 py-3">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-medium">EnDocs AI</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-current opacity-60"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-current opacity-60 animation-delay-200"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-current opacity-60 animation-delay-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <ChatInput 
            onSend={handleSendQuery}
            placeholder="Ask questions about your documents..."
            showSuggestions={true}
            className={isLoading ? "opacity-70 pointer-events-none" : ""}
          />
        </div>
        
        <div className="glass-panel p-4 md:p-6 h-[500px] overflow-y-auto">
          <h3 className="font-medium tracking-tight mb-4 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-primary" />
            Document Sources
          </h3>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              {sortedDocs.length} documents
            </span>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1.5 text-xs"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-3.5 h-3.5" />
              ) : (
                <SortDesc className="w-3.5 h-3.5" />
              )}
              <span>Sort by date</span>
            </Button>
          </div>
          
          <div className="space-y-2">
            {sortedDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="p-3 rounded-lg transition-colors hover:bg-muted/30 cursor-pointer border border-border/40"
                onClick={() => {
                  handleSendQuery(`Tell me about the document "${doc.title}"`);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium text-sm truncate mr-2">{doc.title}</div>
                  <div className="text-xs px-1.5 py-0.5 rounded bg-muted/50">
                    {getDocIcon(doc.type)}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{doc.size} • {doc.pages} pages</span>
                  <span className="text-xs text-muted-foreground">{formatDate(doc.created)}</span>
                </div>
              </div>
            ))}
            
            {sortedDocs.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No documents found matching your search
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnDocs;
