
import React from 'react';
import { Clock, Trash2, PenLine, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChatSession } from '@/components/chat/ChatSessionList';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
          className="text-xs h-8"
        >
          New Chat
        </Button>
      </div>
      
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
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
                "p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                "border border-border/60 flex items-center justify-between",
                activeSessionId === session.id && "bg-muted border-primary/30"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {session.hasDocuments && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FileText className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>Has documents</TooltipContent>
                  </Tooltip>
                )}
                {session.hasVisualizations && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BarChart3 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>Has visualizations</TooltipContent>
                  </Tooltip>
                )}
                <span className="font-medium text-sm truncate">
                  {session.title}
                </span>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Rename functionality would go here
                  }}
                >
                  <PenLine className="h-3 w-3" />
                  <span className="sr-only">Rename session</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
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
