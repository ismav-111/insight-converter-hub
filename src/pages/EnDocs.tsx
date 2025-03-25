
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Bot, User, Clock, Database, MessageSquare } from 'lucide-react';
import DataSourceIndicator from '@/components/shared/DataSourceIndicator';
import DataVisualizer from '@/components/ui/DataVisualizer';
import ChatInput from '@/components/ui/ChatInput';
import { documentData, dataSources, citySalesData } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ChatSessionList from '@/components/chat/ChatSessionList';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { useApp } from '@/contexts/AppContext';

const EnDocs = () => {
  const { 
    // Chat sessions
    sessions,
    activeSessionId,
    createNewSession,
    selectSession,
    deleteSession,
    
    // Messages
    messages,
    addMessage,
    isTyping,
    
    // Documents
    documents,
    uploadDocuments,
    removeDocument,
    isUploading,
    
    // Data source
    currentDataSource,
    setCurrentDataSource
  } = useApp();
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendQuery = (message: string) => {
    // Add user message
    addMessage(message, 'user');
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Determine if this query should show a graph
      const shouldShowGraph = message.toLowerCase().includes('chart') || 
                             message.toLowerCase().includes('graph') || 
                             message.toLowerCase().includes('visualization') ||
                             message.toLowerCase().includes('document') ||
                             Math.random() > 0.5; // 50% chance to show graph for demo purposes
      
      // Generate a simple response
      const responseText = `I've analyzed your documents regarding "${message}" and here's what I found...`;
      
      // Add bot message
      addMessage(responseText, 'bot', shouldShowGraph);
      
      setIsLoading(false);
      
      toast({
        title: "Response generated",
        description: "We've analyzed your documents and updated the visualization.",
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
        className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        variants={itemAnimation}
      >
        <div>
          <div className="pill bg-primary/10 text-primary mb-2 font-medium">
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Document Analysis
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            EnDocs
          </h1>
          <p className="text-muted-foreground">
            Chat with your documents and get insights
          </p>
        </div>

        <DataSourceIndicator 
          currentSource={currentDataSource}
          onSourceChange={setCurrentDataSource}
        />
      </motion.div>

      {/* Main Content Container */}
      <motion.div 
        variants={itemAnimation} 
        className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6"
      >
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-6">
          <div className="glass-panel p-4">
            <ChatSessionList 
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={selectSession}
              onDeleteSession={deleteSession}
              onCreateNewSession={createNewSession}
            />
          </div>
          
          <div className="glass-panel p-4">
            <DocumentUploader 
              documents={documents}
              onUpload={uploadDocuments}
              onRemove={removeDocument}
              isUploading={isUploading}
            />
          </div>
        </div>

        {/* Chat Container */}
        <motion.div 
          variants={itemAnimation} 
          className="glass-panel flex-1 p-4 md:p-6 flex flex-col h-[650px]"
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
            placeholder="Ask about your documents..."
            showSuggestions={true}
            className={isLoading ? "opacity-70 pointer-events-none" : ""}
          />
        </motion.div>
      </motion.div>
      
      {/* Help Text */}
      <motion.div variants={itemAnimation} className="max-w-6xl mx-auto mt-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>Try asking questions like "Analyze document trends" or "Summarize the latest reports"</p>
          <p className="mt-1">Upload documents or change data sources using the controls on the left</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnDocs;
