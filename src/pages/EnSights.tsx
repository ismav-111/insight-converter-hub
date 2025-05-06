import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Upload } from 'lucide-react';
import { dataSources, textResponses, citySalesData } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import ChatContainer, { ChatMessage } from '@/components/chat/ChatContainer';
import PageHeader from '@/components/layout/PageHeader';
import CompactChatSessionList from '@/components/chat/CompactChatSessionList';
import DocumentLibrary from '@/components/documents/DocumentLibrary';
import DataVisualizer from '@/components/ui/DataVisualizer';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const EnSights = () => {
  const { 
    // Chat sessions
    sessions,
    activeSessionId,
    createNewSession,
    selectSession,
    deleteSession,
    
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your EnSights assistant. How can I help you visualize and analyze your data today?",
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: '2',
      content: "Here's a sample visualization of sales data across different cities to help you get started.",
      sender: 'bot',
      timestamp: new Date(),
      showGraph: true
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleSendQuery = (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
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
      // For EnSights, always show graphs/visualizations
      const shouldShowGraph = true; // EnSights always shows graphs
      
      // Get a response based on the query
      let responseText = "";
      if (message.toLowerCase().includes('sales')) {
        responseText = textResponses[0];
      } else if (message.toLowerCase().includes('trend')) {
        responseText = textResponses[2];
      } else if (message.toLowerCase().includes('compare')) {
        responseText = textResponses[3];
      } else {
        // Pick a random response
        const randomIndex = Math.floor(Math.random() * textResponses.length);
        responseText = textResponses[randomIndex];
      }
      
      const botMessage: ChatMessage = {
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
        title: "Visualization generated",
        description: `We've processed your query using ${currentDataSource.name} and created the visualization.`,
        duration: 3000,
      });
    }, 1500);
  };

  const handleUploadClick = () => {
    if (fileInputRef) {
      fileInputRef.click();
    }
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

  // Render visualization for EnSights (graphs)
  const renderVisualization = (message: ChatMessage) => {
    if (message.showGraph && message.sender === 'bot') {
      return (
        <div className="pl-10 pr-10">
          <div className="bg-muted/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Data from: {currentDataSource.name}</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Visual Analysis
              </span>
            </div>
            <div className="w-full">
              <DataVisualizer 
                data={citySalesData}
                title="Data Visualization"
                className="bg-transparent"
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="min-h-screen pt-20 px-4 md:px-8 pb-8 mx-auto"
      initial="hidden"
      animate="show"
      variants={containerAnimation}
    >
      <PageHeader 
        icon={BarChart3}
        title="EnSights"
        subtitle="Chat with your data and get instant visualizations"
        badgeText="Data Visualization"
        currentDataSource={currentDataSource}
        onSourceChange={setCurrentDataSource}
      />

      {/* Main Content Container */}
      <motion.div 
        variants={itemAnimation} 
        className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6"
      >
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-6">
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Chat History</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-7 w-7" 
                    onClick={handleUploadClick}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span className="sr-only">Upload documents</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload documents</TooltipContent>
              </Tooltip>
              
              {/* Hidden file input for document upload */}
              <input
                type="file"
                ref={input => setFileInputRef(input)}
                className="hidden"
                multiple
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    uploadDocuments(Array.from(e.target.files));
                    toast({
                      title: "Documents uploaded",
                      description: `${e.target.files.length} document(s) uploaded successfully.`,
                      duration: 3000,
                    });
                  }
                }}
              />
            </div>
            <CompactChatSessionList 
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={selectSession}
              onDeleteSession={deleteSession}
              onCreateNewSession={createNewSession}
            />
          </div>
          
          {/* Document Library panel (simplified) */}
          <div className="glass-panel p-4">
            <DocumentLibrary 
              documents={documents}
              isUploading={isUploading}
              onRemove={removeDocument}
              showTitle={true}
            />
          </div>
        </div>

        {/* Chat Container */}
        <ChatContainer
          messages={messages}
          isTyping={isTyping}
          isLoading={isLoading}
          currentDataSource={currentDataSource}
          onSendQuery={handleSendQuery}
          renderVisualization={renderVisualization}
        />
      </motion.div>
      
      {/* Help Text */}
      <motion.div variants={itemAnimation} className="max-w-6xl mx-auto mt-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>Try asking questions like "Show sales data by city" or "Create a visualization of quarterly trends"</p>
          <p className="mt-1">You can change data sources using the selector at the top right</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnSights;
