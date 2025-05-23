
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Clock, ArrowDown } from 'lucide-react';
import ChatInput from '@/components/ui/ChatInput';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { DataSource } from '@/lib/mock-data';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showGraph?: boolean;
  showTable?: boolean;
  documentReference?: string;
}

interface ChatContainerProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isLoading: boolean;
  currentDataSource: DataSource;
  onSendQuery: (message: string) => void;
  renderVisualization?: (message: ChatMessage) => React.ReactNode;
  className?: string;
  showDataSourceHeader?: boolean;
}

const ChatContainer = ({
  messages,
  isTyping,
  isLoading,
  currentDataSource,
  onSendQuery,
  renderVisualization,
  className,
  showDataSourceHeader = false
}: ChatContainerProps) => {
  // Format time for chat messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  // Function to scroll to bottom of chat
  const scrollToBottom = () => {
    const chatContainer = document.getElementById('chat-messages-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  return (
    <motion.div 
      variants={itemAnimation} 
      className={cn("glass-panel flex-1 p-4 md:p-6 flex flex-col h-[650px]", className)}
    >
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Chat Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Session started at {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div id="chat-messages-container" className="flex-1 overflow-y-auto pr-2 mb-4 relative">
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
                        {message.sender === 'user' ? 'You' : message.sender === 'bot' ? 'AI Assistant' : ''}
                      </span>
                      <span className="flex items-center text-xs opacity-70">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                    
                    {/* Document reference if available */}
                    {message.sender === 'bot' && message.documentReference && (
                      <div className="mt-2 text-xs italic text-muted-foreground">
                        Source: {message.documentReference}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Render visualization (graph or table) if provided and if it's a bot message */}
              {message.sender === 'bot' && renderVisualization && (
                renderVisualization(message)
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
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Using {currentDataSource.name}
                    </span>
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
        
        {/* Scroll to bottom button - appears when there are many messages */}
        {messages.length > 4 && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-0 right-2 bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="relative">
        {(isTyping || showDataSourceHeader) && (
          <div className="absolute -top-6 left-0 right-0 text-center">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block">
              Using data source: {currentDataSource.name}
            </span>
          </div>
        )}
        <ChatInput 
          onSend={onSendQuery}
          placeholder="Ask a question..."
          showSuggestions={true}
          className={isLoading ? "opacity-70 pointer-events-none" : ""}
        />
      </div>
    </motion.div>
  );
};

export default ChatContainer;
