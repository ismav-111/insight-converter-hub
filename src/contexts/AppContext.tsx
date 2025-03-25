
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ChatSession } from '@/components/chat/ChatSessionList';
import { UploadedDocument } from '@/components/documents/DocumentUploader';
import { DataSource, dataSources } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showGraph?: boolean;
}

interface AppContextType {
  // Chat sessions
  sessions: ChatSession[];
  activeSessionId: string | null;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  
  // Messages
  messages: Message[];
  addMessage: (content: string, sender: 'user' | 'bot', showGraph?: boolean) => void;
  isTyping: boolean;
  
  // Documents
  documents: UploadedDocument[];
  uploadDocuments: (files: File[]) => void;
  removeDocument: (documentId: string) => void;
  isUploading: boolean;
  
  // Data sources
  currentDataSource: DataSource;
  setCurrentDataSource: (source: DataSource) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Documents state
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Data source state
  const [currentDataSource, setCurrentDataSource] = useState<DataSource>(dataSources[0]);
  
  const { toast } = useToast();

  // Initialize with a default session on first load
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, []);

  // Load active session messages when session changes
  useEffect(() => {
    if (activeSessionId) {
      // In a real app, you would load messages from a database or API
      // For this demo, we'll just set a default welcome message if there are no messages
      if (messages.length === 0) {
        setMessages([
          {
            id: '1',
            content: "Hello! I'm your AI assistant. How can I help you analyze your data today?",
            sender: 'bot',
            timestamp: new Date(),
          }
        ]);
      }
    }
  }, [activeSessionId]);

  const createNewSession = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: `New Chat ${sessions.length + 1}`,
      timestamp: new Date(),
      preview: "Start a new conversation",
      hasDocuments: false,
      hasVisualizations: false
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setMessages([
      {
        id: '1',
        content: "Hello! I'm your AI assistant. How can I help you analyze your data today?",
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
  };

  const selectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // In a real app, you would load messages for this session from storage
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    if (activeSessionId === sessionId) {
      // If we deleted the active session, select the first available or create a new one
      if (sessions.length > 1) {
        const newActiveSession = sessions.find(s => s.id !== sessionId);
        if (newActiveSession) {
          setActiveSessionId(newActiveSession.id);
        }
      } else {
        createNewSession();
      }
    }
    
    toast({
      title: "Session deleted",
      description: "Chat session has been removed",
      duration: 3000,
    });
  };

  const addMessage = (content: string, sender: 'user' | 'bot', showGraph: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      showGraph
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update session preview with latest message
    if (activeSessionId) {
      setSessions(prev => {
        return prev.map(session => {
          if (session.id === activeSessionId) {
            // Update title for user messages if it's a new chat
            let title = session.title;
            if (sender === 'user' && session.title.startsWith('New Chat')) {
              // Use first 30 characters of user message as title
              title = content.length > 30 ? content.substring(0, 30) + '...' : content;
            }
            
            return {
              ...session,
              title,
              preview: content,
              timestamp: new Date(),
              hasVisualizations: session.hasVisualizations || showGraph
            };
          }
          return session;
        });
      });
    }
  };

  const uploadDocuments = (files: File[]) => {
    setIsUploading(true);
    
    // Simulate an upload delay
    setTimeout(() => {
      const newDocuments: UploadedDocument[] = files.map(file => ({
        id: Date.now() + Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date()
      }));
      
      setDocuments(prev => [...prev, ...newDocuments]);
      setIsUploading(false);
      
      // Update the active session to show it has documents
      if (activeSessionId) {
        setSessions(prev => {
          return prev.map(session => {
            if (session.id === activeSessionId) {
              return {
                ...session,
                hasDocuments: true
              };
            }
            return session;
          });
        });
      }
      
      toast({
        title: "Documents uploaded",
        description: `${files.length} document${files.length === 1 ? '' : 's'} added to your library`,
        duration: 3000,
      });
    }, 1500);
  };

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    
    toast({
      title: "Document removed",
      description: "Document has been removed from your library",
      duration: 3000,
    });
  };

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
