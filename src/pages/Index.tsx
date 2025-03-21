
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bot, User, Clock, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DataSourceIndicator from '@/components/shared/DataSourceIndicator';
import ChatInput from '@/components/ui/ChatInput';
import { DataSource, dataSources, textResponses } from '@/lib/mock-data';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Index = () => {
  const navigate = useNavigate();
  const [currentDataSource, setCurrentDataSource] = useState<DataSource>(dataSources[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm the Enplify assistant. How can I help you today?",
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
    <div className="flex h-screen">
      {/* Left sidebar */}
      <aside className="w-60 hidden md:block border-r border-border bg-muted/20 shrink-0">
        <div className="px-4 py-6 h-full flex flex-col">
          <h2 className="text-xl font-bold mb-6">Enplify.ai</h2>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => navigate('/')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => navigate('/encore')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              EnCore
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => navigate('/endocs')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              EnDocs
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => navigate('/ensights')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              EnSights
            </Button>
          </div>
          <div className="mt-auto">
            <DataSourceIndicator 
              currentSource={currentDataSource}
              onSourceChange={setCurrentDataSource}
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <motion.div 
        className="flex-1 flex flex-col h-screen pt-16 px-4 md:pl-8 md:pr-8 pb-4 overflow-hidden"
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
              Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Welcome to Enplify.ai
            </h1>
            <p className="text-muted-foreground">
              Your intelligent dashboard for data insights and analysis
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex-1 glass-panel p-4 md:p-6 mb-6 overflow-hidden flex flex-col"
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
                          {message.sender === 'user' ? 'You' : 'Enplify AI'}
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
                        <span className="text-xs font-medium">Enplify AI</span>
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
              showSuggestions={true}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/95 dark:bg-gray-950/95 shadow-sm backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">EnCore</CardTitle>
              <CardDescription>Text-based insights</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground mb-3">Conversational AI assistant for text analysis</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/encore')}>
                Go to EnCore
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-950/95 shadow-sm backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">EnDocs</CardTitle>
              <CardDescription>Document analysis</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground mb-3">Tables and text for structured information</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/endocs')}>
                Go to EnDocs
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-950/95 shadow-sm backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">EnSights</CardTitle>
              <CardDescription>Data visualization</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground mb-3">Advanced charts and analytics</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/ensights')}>
                Go to EnSights
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
