
import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Mic, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { sampleQueries } from '@/lib/mock-data';

interface ChatInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
}

const ChatInput = ({ 
  onSend,
  placeholder = "Start typing...", 
  className,
  showSuggestions = true
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-adjust height
    const newRows = e.target.value.split('\n').length;
    const calculatedRows = Math.min(Math.max(1, newRows), 5);
    setRows(calculatedRows);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      if (onSend) {
        onSend(message);
      } else {
        toast({
          title: "Message sent",
          description: "Your message has been processed.",
          duration: 3000,
        });
      }
      setMessage('');
      setRows(1);
      
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleSuggestionClick = (query: string) => {
    setMessage(query);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {showSuggestions && isFocused && !message && (
        <div className="mb-3 flex flex-wrap gap-2 animate-slide-up">
          {sampleQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(query)}
              className="pill bg-secondary/80 hover:bg-secondary text-secondary-foreground transition-colors"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {query}
            </button>
          ))}
        </div>
      )}

      <div 
        className={cn(
          "relative flex items-end w-full rounded-xl border transition-all duration-200 overflow-hidden",
          "bg-white dark:bg-gray-950",
          isFocused 
            ? "shadow-[0_0_0_2px_rgba(74,144,226,0.3)] border-primary/50" 
            : "border-border shadow-sm hover:border-gray-400/50 dark:hover:border-gray-700/50"
        )}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          placeholder={placeholder}
          className={cn(
            "flex-1 max-h-32 py-3 pl-4 pr-12 bg-transparent resize-none outline-none",
            "text-foreground placeholder:text-muted-foreground"
          )}
        />

        <div className="absolute bottom-2 right-2 flex items-center space-x-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => toast({
              title: "Feature not implemented",
              description: "File upload is not available in this demo.",
              duration: 3000
            })}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => toast({
              title: "Feature not implemented",
              description: "Voice input is not available in this demo.",
              duration: 3000
            })}
          >
            <Mic className="h-4 w-4" />
            <span className="sr-only">Voice input</span>
          </Button>
          
          <Button
            type="button"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-200",
              message.trim() 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-muted text-muted-foreground"
            )}
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
