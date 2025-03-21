
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowDown, Bot, User, Clock } from 'lucide-react';
import DataSourceIndicator from '@/components/shared/DataSourceIndicator';
import ChatInput from '@/components/ui/ChatInput';
import { DataSource, dataSources, textResponses } from '@/lib/mock-data';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const EnCore = () => {
  const [currentDataSource, setCurrentDataSource] = useState<DataSource>(dataSources[2]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm EnCore, your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      // Pick a random response from the text responses
      const randomIndex = Math.floor(Math.random() * textResponses.length);
      const botResponse = textResponses[randomIndex];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      className="pt-20 px-4 md:px-8 pb-8 max-w-6xl mx-auto min-h-screen flex flex-col"
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
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            EnCore
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            AI Assistant
          </h1>
          <p className="text-muted-foreground">
            Your intelligent assistant for data insights and analysis
          </p>
        </div>

        <DataSourceIndicator 
          currentSource={currentDataSource}
          onSourceChange={setCurrentDataSource}
        />
      </motion.div>

      <motion.div 
        className="flex-1 glass-panel p-4 md:p-6 mb-6 flex flex-col"
        variants={itemAnimation}
      >
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6 pb-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex items-start max-w-[80%] md:max-w-[70%]",
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
                        {message.sender === 'user' ? 'You' : 'EnCore'}
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
            ))}
            
            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="flex items-start max-w-[80%] md:max-w-[70%]">
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="bg-violet-100 text-violet-800 text-xs">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-medium">EnCore</span>
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
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="pt-4 border-t border-border/40 mt-auto">
          {messages.length > 5 && (
            <div className="pb-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 text-xs"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-3.5 w-3.5" />
                Scroll to bottom
              </Button>
            </div>
          )}

          <ChatInput 
            onSend={handleSendMessage}
            placeholder="Ask me anything..."
            showSuggestions={false}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnCore;
