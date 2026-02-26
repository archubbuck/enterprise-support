import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DownloadSimple, ArrowSquareOut } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SupportDocument } from '@/lib/documents';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { PdfViewerLazy } from './pdf-viewer-lazy';
import { WordViewerLazy } from './word-viewer-lazy';

interface DocumentViewerProps {
  document: SupportDocument;
  onBack: () => void;
}

/**
 * Full-screen document viewer with embed-first strategy.
 *
 * Rendering order per type:
 *   markdown → sanitised HTML via marked + DOMPurify
 *   pdf      → react-pdf inline viewer (lazy), fallback external open
 *   image    → inline <img>, fallback external open
 *   word     → mammoth HTML conversion (lazy), fallback download
 *
 * If the embedded viewer reports an error, an "Open externally" button
 * is shown automatically so the user is never stuck.
 */
export function DocumentViewer({ document, onBack }: DocumentViewerProps) {
  // Track whether the embedded viewer failed so we can surface the fallback action
  const [embedFailed, setEmbedFailed] = useState(false);

  const handleEmbedError = useCallback(() => setEmbedFailed(true), []);

  // Sanitised markdown HTML (memoised to avoid re-parsing on re-render)
  const htmlContent = useMemo(() => {
    if (document.type !== 'markdown') return '';
    const raw = marked.parse(document.content) as string;
    return DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
        'strong', 'em', 'u', 's', 'del', 'ins', 'sub', 'sup',
        'a', 'img', 'blockquote', 'pre', 'code', 'span',
        'dl', 'dt', 'dd', 'details', 'summary',
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id',
        'colspan', 'rowspan', 'target', 'rel',
      ],
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'], // allow target="_blank" links
    });
  }, [document.type, document.content]);

  /** Open the file URL externally (new tab / system handler) */
  const openExternally = useCallback(() => {
    if (document.fileUrl) window.open(document.fileUrl, '_blank');
  }, [document.fileUrl]);

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
            <PdfViewerLazy fileUrl={document.fileUrl} title={document.title} onError={handleEmbedError} />
            {embedFailed && <FallbackAction label="Open PDF" onClick={openExternally} />}
          </div>
        );

      case 'image':
        if (!document.fileUrl) {
          return <div className="text-center py-8 text-sm text-muted-foreground">File URL not available</div>;
        }
        return (
          <div className="space-y-4">
            <img
              src={document.fileUrl}
              alt={document.title}
              className="w-full h-auto rounded-lg border border-border"
              onError={handleEmbedError}
            />
            {embedFailed && <FallbackAction label="Open Image" onClick={openExternally} />}
          </div>
        );

      case 'word':
        if (!document.fileUrl) {
          return <div className="text-center py-8 text-sm text-muted-foreground">File URL not available</div>;
        }
        return (
          <div className="space-y-4">
            <WordViewerLazy fileUrl={document.fileUrl} title={document.title} onError={handleEmbedError} />
            {embedFailed && <FallbackAction label="Download Document" onClick={openExternally} />}
          </div>
        );

      case 'unknown':
      default:
        return (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">This document type is not supported for in-app viewing.</p>
            {document.fileUrl && (
              <Button variant="outline" size="sm" onClick={openExternally} className="mt-4 gap-2">
                <DownloadSimple className="w-4 h-4" />
                Open Externally
              </Button>
            )}
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

        {/* Secondary action: always offer external open for file-backed documents */}
        {document.fileUrl && (
          <Button
            variant="ghost"
            size="icon"
            onClick={openExternally}
            className="shrink-0 h-9 w-9"
            title="Open externally"
          >
            <ArrowSquareOut className="w-5 h-5" />
          </Button>
        )}
      </header>

      <ScrollArea className="flex-1">
        <div className="px-5 py-6">
          {renderDocumentContent()}
        </div>
      </ScrollArea>
    </motion.div>
  );
}

/** Auto-fallback action shown when embedded viewing fails */
function FallbackAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <span className="text-sm text-muted-foreground">
        Unable to display inline — open externally instead.
      </span>
      <Button variant="outline" size="sm" onClick={onClick} className="gap-2 shrink-0 ml-3">
        <DownloadSimple className="w-4 h-4" />
        {label}
      </Button>
    </div>
  );
}
