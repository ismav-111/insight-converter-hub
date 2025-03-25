
import React, { useState } from 'react';
import { Upload, X, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
}

interface DocumentUploaderProps {
  documents: UploadedDocument[];
  onUpload: (files: File[]) => void;
  onRemove: (documentId: string) => void;
  isUploading?: boolean;
}

const DocumentUploader = ({
  documents,
  onUpload,
  onRemove,
  isUploading = false
}: DocumentUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      onUpload(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onUpload(files);
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-medium mb-2">Document Library</h3>
      
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center",
          "transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          isUploading && "opacity-70 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.xls"
        />
        
        <div className="flex flex-col items-center justify-center py-2">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">
            Drag and drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PDFs, Word documents, text files, CSV, and Excel files
          </p>
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Uploading document...
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="p-2 rounded-md border border-border/60 flex items-center gap-2"
            >
              <File className="h-5 w-5 text-primary/70" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{formatFileSize(doc.size)}</span>
                  <span className="mx-1">•</span>
                  <span>{doc.uploadDate.toLocaleDateString()}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full shrink-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onRemove(doc.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
