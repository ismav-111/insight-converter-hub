
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Clock, Database, FileText, BarChart3, MessageSquare } from 'lucide-react';
import DataSourceIndicator from '@/components/shared/DataSourceIndicator';
import DataVisualizer from '@/components/ui/DataVisualizer';
import ChatInput from '@/components/ui/ChatInput';
import { DataSource, dataSources, textResponses, citySalesData } from '@/lib/mock-data';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showGraph?: boolean;
}

const Index = () => {
  const [currentDataSource, setCurrentDataSource] = useState<DataSource>(dataSources[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you analyze your data today?",
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

  // Format time for chat messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

  return (
    <motion.div 
      className="min-h-screen pt-20 px-4 md:px-8 pb-8 mx-auto"
      initial="hidden"
      animate="show"
      variants={containerAnimation}
    >
      <motion.div 
        className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        variants={itemAnimation}
      >
        <div>
          <div className="pill bg-primary/10 text-primary mb-2 font-medium">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Analytics Chat
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Data Assistant
          </h1>
          <p className="text-muted-foreground">
            Chat with your data and get instant visualizations
          </p>
        </div>

        <DataSourceIndicator 
          currentSource={currentDataSource}
          onSourceChange={setCurrentDataSource}
        />
      </motion.div>

      {/* Main Chat Container */}
      <motion.div 
        variants={itemAnimation} 
        className="glass-panel max-w-5xl mx-auto p-4 md:p-6 flex flex-col h-[650px] mb-6"
      >
        <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Current Data Source: <span className="text-primary">{currentDataSource.name}</span></h3>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Session started at {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        
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
                          {message.sender === 'user' ? 'You' : 'AI Assistant'}
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
                      title="Data Visualization"
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
                      <span className="text-xs font-medium">AI Assistant</span>
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
          placeholder="Ask about your data, request visualizations, or analyze trends..."
          showSuggestions={true}
          className={isLoading ? "opacity-70 pointer-events-none" : ""}
        />
      </motion.div>
      
      {/* Data Source Info */}
      <motion.div variants={itemAnimation} className="max-w-5xl mx-auto">
        <div className="text-center text-sm text-muted-foreground">
          <p>Try asking questions like "Show me sales data by city" or "Create a visualization of quarterly trends"</p>
          <p className="mt-1">You can change data sources using the selector at the top right</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
