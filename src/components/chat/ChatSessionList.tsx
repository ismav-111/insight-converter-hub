
import React from 'react';
import { Clock, Trash2, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
  hasDocuments: boolean;
  hasVisualizations: boolean;
}

interface ChatSessionListProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onCreateNewSession: () => void;
}

const ChatSessionList = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onCreateNewSession
}: ChatSessionListProps) => {
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Chat Sessions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCreateNewSession}
          className="text-xs h-8"
        >
          New Chat
        </Button>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {sessions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No chat sessions yet
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={cn(
                "p-3 rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                "border border-border/60 flex flex-col gap-1",
                activeSessionId === session.id && "bg-muted border-primary/30"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm truncate mr-2">
                  {session.title}
                </span>
                <div className="flex items-center gap-1">
                  {session.hasDocuments && (
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  {session.hasVisualizations && (
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete session</span>
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {session.preview}
              </p>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(session.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSessionList;
