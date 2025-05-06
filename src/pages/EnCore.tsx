
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import ChatContainer, { ChatMessage } from '@/components/chat/ChatContainer';
import PageHeader from '@/components/layout/PageHeader';
import CompactChatSessionList from '@/components/chat/CompactChatSessionList';
import DataVisualizer from '@/components/ui/DataVisualizer';
import { citySalesData } from '@/lib/mock-data';

const EnCore = () => {
  const { 
    sessions,
    activeSessionId,
    createNewSession,
    selectSession,
    deleteSession,
    currentDataSource,
    setCurrentDataSource
  } = useApp();
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your EnCore assistant. I can help you with general queries about your data. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
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
      // Determine if this query should show a graph
      const shouldShowGraph = message.toLowerCase().includes('chart') || 
                             message.toLowerCase().includes('graph') || 
                             message.toLowerCase().includes('visualization') ||
                             message.toLowerCase().includes('data') ||
                             Math.random() > 0.5; // 50% chance to show graph for demo purposes
                             
      // Generate a response based on the data source
      const responseText = `I've analyzed your query about "${message}" using the ${currentDataSource.name} data source. Here's what I found...`;
      
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
        title: "Response generated",
        description: `Query processed using ${currentDataSource.name}`,
        duration: 3000,
      });
    }, 1500);
  };

  // Render visualization
  const renderVisualization = (message: ChatMessage) => {
    if (message.showGraph && message.sender === 'bot') {
      return (
        <div className="pl-10 pr-10">
          <DataVisualizer 
            data={citySalesData}
            title="Data Visualization"
            className="bg-muted/10"
          />
        </div>
      );
    }
    return null;
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
      <PageHeader
        icon={MessageSquare}
        title="EnCore"
        subtitle="Chat with your data assistant for general inquiries"
        badgeText="General Assistant"
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
            <CompactChatSessionList 
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={selectSession}
              onDeleteSession={deleteSession}
              onCreateNewSession={createNewSession}
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
          <p>Try asking questions like "What insights can you provide about my data?" or "Help me understand my current dataset"</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnCore;
