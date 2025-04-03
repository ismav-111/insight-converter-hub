import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DataVisualizer from '@/components/ui/DataVisualizer';
import { citySalesData } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import ChatContainer, { ChatMessage } from '@/components/chat/ChatContainer';
import CompactChatSessionList from '@/components/chat/CompactChatSessionList';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { useApp } from '@/contexts/AppContext';
import PageHeader from '@/components/layout/PageHeader';

const Index = () => {
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
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you analyze your data today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
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
      
      // Generate a simple response
      const responseText = `I've analyzed your request about "${message}" and here's what I found...`;
      
      // Add bot message
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
        description: "We've processed your query and updated the visualization.",
        duration: 3000,
      });
    }, 1500);
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

  // Feature cards data
  const features = [
    {
      title: "EnCore",
      description: "General AI assistant for all your data needs",
      icon: <MessageSquare className="w-10 h-10 text-primary" />,
      route: "/encore",
      color: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/30"
    },
    {
      title: "EnDocs",
      description: "Analyze and extract insights from your documents",
      icon: <FileText className="w-10 h-10 text-primary" />,
      route: "/endocs",
      color: "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-900/30"
    },
    {
      title: "EnSights",
      description: "Visualize your data with powerful charts and graphs",
      icon: <BarChart3 className="w-10 h-10 text-primary" />,
      route: "/ensights",
      color: "bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/30 dark:to-teal-900/30"
    }
  ];

  return (
    <motion.div 
      className="min-h-screen pt-20 px-4 md:px-8 pb-8 mx-auto"
      initial="hidden"
      animate="show"
      variants={containerAnimation}
    >
      <PageHeader
        icon={MessageSquare}
        title="Data Assistant"
        subtitle="Chat with your data and get instant visualizations"
        badgeText="Analytics Chat"
        currentDataSource={currentDataSource}
        onSourceChange={setCurrentDataSource}
      />

      {/* Features Section */}
      <motion.div 
        variants={itemAnimation} 
        className="max-w-6xl mx-auto mb-8"
      >
        <h2 className="text-2xl font-semibold mb-6">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div 
              key={feature.title}
              whileHover={{ scale: 1.03 }}
              className={`${feature.color} rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-all`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <Button variant="outline" asChild>
                <Link to={feature.route} className="flex items-center gap-2">
                  Explore {feature.title} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
        <ChatContainer
          messages={messages}
          isTyping={isTyping}
          isLoading={isLoading}
          currentDataSource={currentDataSource}
          onSendQuery={handleSendQuery}
          renderVisualization={renderVisualization}
          showDataSourceHeader={isTyping}
        />
      </motion.div>
      
      {/* Help Text */}
      <motion.div variants={itemAnimation} className="max-w-6xl mx-auto mt-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>Try asking questions like "Show me sales data by city" or "Create a visualization of quarterly trends"</p>
          <p className="mt-1">Upload documents or change data sources to analyze different information</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
