
import React from 'react';
import { Trash2, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChatSession } from '@/components/chat/ChatSessionList';

interface CompactChatSessionListProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onCreateNewSession: () => void;
}

const CompactChatSessionList = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onCreateNewSession
}: CompactChatSessionListProps) => {
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Chat Sessions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCreateNewSession}
          className="text-xs h-7"
        >
          New Chat
        </Button>
      </div>
      
      <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
        {sessions.length === 0 ? (
          <div className="text-center py-3 text-muted-foreground text-xs">
            No chat sessions yet
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={cn(
                "py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                "border border-border/30 flex items-center justify-between",
                activeSessionId === session.id && "bg-muted border-primary/30"
              )}
            >
              <div className="flex items-center overflow-hidden">
                <span className="font-medium text-xs truncate">
                  {session.title}
                </span>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Rename functionality would go here
                  }}
                >
                  <PenLine className="h-2.5 w-2.5" />
                  <span className="sr-only">Rename session</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                >
                  <Trash2 className="h-2.5 w-2.5" />
                  <span className="sr-only">Delete session</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompactChatSessionList;
