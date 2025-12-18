import { motion } from 'framer-motion';
import { ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SupportDocument } from '@/lib/documents';
import { marked } from 'marked';

interface DocumentViewerProps {
  document: SupportDocument;
  onBack: () => void;
}

export function DocumentViewer({ document, onBack }: DocumentViewerProps) {
  const htmlContent = marked.parse(document.content) as string;

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
        </div>
      </ScrollArea>
    </motion.div>
  );
}
