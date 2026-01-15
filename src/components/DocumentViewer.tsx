import { motion } from 'framer-motion';
import { ArrowLeft, DownloadSimple } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SupportDocument } from '@/lib/documents';
import { marked } from 'marked';
import { PdfViewerLazy } from './PdfViewerLazy';

interface DocumentViewerProps {
  document: SupportDocument;
  onBack: () => void;
}

export function DocumentViewer({ document, onBack }: DocumentViewerProps) {
  const htmlContent = document.type === 'markdown' ? marked.parse(document.content) as string : '';

  const renderDocumentContent = () => {
    switch (document.type) {
      case 'markdown':
        return (
          <article 
            className="prose prose-sm max-w-none
              prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight
              prose-h1:text-lg prose-h1:mb-4 prose-h1:mt-0
              prose-h2:text-base prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-sm prose-h3:mt-6 prose-h3:mb-2
              prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:text-sm
              prose-li:text-foreground/80 prose-li:text-sm
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-normal
              prose-table:text-xs
              prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-medium prose-th:text-foreground
              prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-border
            "
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      
      case 'pdf':
        if (!document.fileUrl) {
          return <div className="text-center py-8 text-sm text-muted-foreground">File URL not available</div>;
        }
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">PDF Document</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="gap-2"
              >
                <DownloadSimple className="w-4 h-4" />
                Open PDF
              </Button>
            </div>
            <PdfViewerLazy fileUrl={document.fileUrl} title={document.title} />
          </div>
        );
      
      case 'image':
        if (!document.fileUrl) {
          return <div className="text-center py-8 text-sm text-muted-foreground">File URL not available</div>;
        }
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Image Document</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="gap-2"
              >
                <DownloadSimple className="w-4 h-4" />
                Open Image
              </Button>
            </div>
            <img
              src={document.fileUrl}
              alt={document.title}
              className="w-full h-auto rounded-lg border border-border"
            />
          </div>
        );
      
      case 'word':
        if (!document.fileUrl) {
          return <div className="text-center py-8 text-sm text-muted-foreground">File URL not available</div>;
        }
        return (
          <div className="space-y-4">
            <div className="p-6 bg-muted/50 rounded-lg text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                  <path d="M8 15h8v2H8zm0-3h8v2H8zm0-3h5v2H8z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-2">Word Document</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This is a Microsoft Word document. Download it to view the full content.
                </p>
              </div>
              <Button
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="gap-2"
              >
                <DownloadSimple className="w-4 h-4" />
                Download Document
              </Button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Unsupported document type</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      <header className="flex items-center gap-2 px-2 py-3 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 h-9 w-9"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm truncate text-foreground">{document.title}</h1>
          <p className="text-xs text-muted-foreground">{document.category}</p>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="px-5 py-6">
          {renderDocumentContent()}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
