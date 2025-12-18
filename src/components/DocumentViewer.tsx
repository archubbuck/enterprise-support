import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 -ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm truncate">{document.title}</h1>
          <Badge variant="secondary" className="text-[10px] mt-0.5">
            {document.category}
          </Badge>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="px-5 py-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Support Document</p>
              <p className="text-sm font-medium text-foreground">Barings IT</p>
            </div>
          </div>
          
          <article 
            className="prose prose-sm max-w-none
              prose-headings:text-foreground prose-headings:font-semibold
              prose-h1:text-xl prose-h1:mb-4 prose-h1:mt-0
              prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
              prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
              prose-p:text-foreground/90 prose-p:leading-relaxed
              prose-li:text-foreground/90
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
              prose-table:text-sm
              prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-medium
              prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-border
            "
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </ScrollArea>
    </motion.div>
  );
}
