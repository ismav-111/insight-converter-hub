
import React from 'react';
import { File, FileText, FileSpreadsheet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UploadedDocument } from '@/components/documents/DocumentUploader';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Example documents to display when no documents are uploaded
const exampleDocuments = [
  {
    id: 'example-1',
    name: 'Annual_Report_2023.pdf',
    type: 'application/pdf',
    size: 2500000, // 2.5 MB
    uploadDate: new Date('2023-12-15')
  },
  {
    id: 'example-2',
    name: 'Sales_Data_Q4.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 1200000, // 1.2 MB
    uploadDate: new Date('2024-01-10')
  },
  {
    id: 'example-3',
    name: 'Project_Proposal.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 850000, // 850 KB
    uploadDate: new Date('2024-02-22')
  }
];

interface DocumentLibraryProps {
  documents: UploadedDocument[];
  isUploading: boolean;
  onRemove: (documentId: string) => void;
  showTitle?: boolean;
}

const DocumentLibrary = ({
  documents,
  isUploading,
  onRemove,
  showTitle = false
}: DocumentLibraryProps) => {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  // Get icon based on file type
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('xlsx')) {
      return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
    }
    if (type.includes('word') || type.includes('document') || type.includes('docx')) {
      return <FileText className="w-4 h-4 text-blue-600" />;
    }
    return <File className="w-4 h-4 text-gray-600" />;
  };

  const displayDocuments = documents.length > 0 ? documents : exampleDocuments;
  
  return (
    <div className="w-full">
      {showTitle && <h3 className="text-sm font-medium mb-3">Document Library</h3>}
      
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
        {displayDocuments.map((doc) => (
          <div 
            key={doc.id}
            className={cn(
              "p-2 rounded-md border border-border/60 flex items-center justify-between",
              documents.length === 0 ? "opacity-70" : ""
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {getFileIcon(doc.type)}
              <div className="overflow-hidden">
                <p className="text-xs font-medium truncate">{doc.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {documents.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onRemove(doc.id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove document</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove document</TooltipContent>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentLibrary;
