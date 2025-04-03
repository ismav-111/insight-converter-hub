
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { documentData, dataSources } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { useApp } from '@/contexts/AppContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ChatContainer, { ChatMessage } from '@/components/chat/ChatContainer';
import PageHeader from '@/components/layout/PageHeader';
import CompactChatSessionList from '@/components/chat/CompactChatSessionList';
import DocumentLibrary from '@/components/documents/DocumentLibrary';

const EnDocs = () => {
  const { 
    sessions,
    activeSessionId,
    createNewSession,
    selectSession,
    deleteSession,
    
    documents,
    uploadDocuments,
    removeDocument,
    isUploading,
    
    currentDataSource,
    setCurrentDataSource
  } = useApp();
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your EnDocs assistant. Upload documents to get started, then ask me questions about them.",
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
    
    // Check if documents are available
    if (documents.length === 0 && isUploading === false) {
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "Please upload some documents first so I can analyze them and answer your questions.",
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        setIsTyping(false);
        
        toast({
          title: "No documents available",
          description: "Please upload documents to analyze.",
          duration: 3000,
        });
      }, 1000);
      return;
    }
    
    setTimeout(() => {
      const shouldShowTable = message.toLowerCase().includes('table') || 
                             message.toLowerCase().includes('document') ||
                             Math.random() > 0.5;
      
      // Select a random document as reference
      const randomDocIndex = Math.floor(Math.random() * documentData.length);
      const randomDoc = documentData[randomDocIndex];
      
      const responseText = `I've analyzed your documents regarding "${message}" and here's what I found...`;
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: 'bot',
        timestamp: new Date(),
        showTable: shouldShowTable,
        documentReference: randomDoc.title
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setIsTyping(false);
      
      toast({
        title: "Response generated",
        description: `We've analyzed your documents using ${currentDataSource.name} and provided the results.`,
        duration: 3000,
      });
    }, 1500);
  };

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

  // Render visualization for EnDocs (tables)
  const renderVisualization = (message: ChatMessage) => {
    if (message.showTable && message.sender === 'bot') {
      return (
        <div className="pl-10 pr-10">
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Document Analysis Results</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                From {currentDataSource.name}
              </span>
            </div>
            <div className="w-full overflow-x-auto pt-2">
              <Table>
                <TableHeader className="bg-secondary/50">
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Relevance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentData.map((doc, i) => {
                    const relevance = 85 - (i * 10);
                    
                    return (
                      <TableRow key={i} className="transition-colors hover:bg-muted/30">
                        <TableCell className="font-medium">{doc.title}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.created}</TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            "inline-block px-2 py-0.5 rounded text-xs font-medium",
                            relevance > 80 ? "bg-green-100 text-green-800" : 
                            relevance > 50 ? "bg-blue-100 text-blue-800" : 
                            "bg-amber-100 text-amber-800"
                          )}>
                            {relevance}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
        icon={FileText}
        title="EnDocs"
        subtitle="Chat with your documents and get text-based insights"
        badgeText="Document Analysis"
        currentDataSource={currentDataSource}
        onSourceChange={setCurrentDataSource}
      />

      <motion.div 
        variants={itemAnimation} 
        className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6"
      >
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
            <DocumentLibrary 
              documents={documents}
              isUploading={isUploading}
              onRemove={removeDocument}
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
        />
      </motion.div>
      
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
