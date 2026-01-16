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
            className="prose prose-sm max-w-none brutalist-markdown
              prose-headings:text-black prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
              prose-h1:text-xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:border-b-4 prose-h1:border-black prose-h1:pb-3
              prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-black prose-h2:pl-3
              prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-black prose-p:leading-relaxed prose-p:text-sm
              prose-li:text-black prose-li:text-sm prose-li:marker:text-[#CCFF00]
              prose-strong:text-black prose-strong:font-black
              prose-code:bg-black prose-code:text-[#CCFF00] prose-code:px-2 prose-code:py-1 prose-code:font-bold prose-code:text-xs
              prose-pre:bg-black prose-pre:border-3 prose-pre:border-black
              prose-table:text-xs prose-table:border-3 prose-table:border-black
              prose-th:bg-black prose-th:text-[#CCFF00] prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-black prose-th:uppercase prose-th:tracking-wider
              prose-td:px-4 prose-td:py-3 prose-td:border-2 prose-td:border-black
              prose-a:text-black prose-a:font-bold prose-a:underline prose-a:decoration-[#CCFF00] prose-a:decoration-2
            "
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      
      case 'pdf':
        if (!document.fileUrl) {
          return <div className="text-center py-8 text-sm font-bold uppercase text-gray-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>FILE URL NOT AVAILABLE</div>;
        }
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white border-3 border-black" style={{ boxShadow: '4px 4px 0 #000' }}>
              <span className="text-xs font-black uppercase tracking-wider text-black" style={{ fontFamily: "'JetBrains Mono', monospace" }}>PDF DOCUMENT</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="gap-2 bg-[#CCFF00] border-3 border-black font-black uppercase text-black hover:bg-[#A3CC00]"
                style={{ fontFamily: "'JetBrains Mono', monospace", boxShadow: '3px 3px 0 #000' }}
              >
                <DownloadSimple className="w-4 h-4" weight="bold" />
                OPEN PDF
              </Button>
            </div>
            <PdfViewerLazy fileUrl={document.fileUrl} title={document.title} />
          </div>
        );
      
      case 'image':
        if (!document.fileUrl) {
          return <div className="text-center py-8 text-sm font-bold uppercase text-gray-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>FILE URL NOT AVAILABLE</div>;
        }
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white border-3 border-black" style={{ boxShadow: '4px 4px 0 #000' }}>
              <span className="text-xs font-black uppercase tracking-wider text-black" style={{ fontFamily: "'JetBrains Mono', monospace" }}>IMAGE DOCUMENT</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="gap-2 bg-[#CCFF00] border-3 border-black font-black uppercase text-black hover:bg-[#A3CC00]"
                style={{ fontFamily: "'JetBrains Mono', monospace", boxShadow: '3px 3px 0 #000' }}
              >
                <DownloadSimple className="w-4 h-4" weight="bold" />
                OPEN
              </Button>
            </div>
            <img
              src={document.fileUrl}
              alt={document.title}
              className="w-full h-auto border-4 border-black"
              style={{ boxShadow: '6px 6px 0 #000' }}
            />
          </div>
        );
      
      case 'word':
        if (!document.fileUrl) {
          return <div className="text-center py-8 text-sm font-bold uppercase text-gray-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>FILE URL NOT AVAILABLE</div>;
        }
        return (
          <div className="space-y-4">
            <div className="p-8 bg-white border-4 border-black text-center space-y-6" style={{ boxShadow: '8px 8px 0 #000' }}>
              <div className="w-20 h-20 mx-auto bg-[#00FFFF] border-4 border-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0 #000' }}>
                <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                  <path d="M8 15h8v2H8zm0-3h8v2H8zm0-3h5v2H8z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black text-black uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  WORD DOCUMENT
                </h3>
                <p className="text-xs text-gray-600 mb-6 uppercase tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  DOWNLOAD TO VIEW FULL CONTENT
                </p>
              </div>
              <Button
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="gap-2 bg-[#CCFF00] border-3 border-black font-black uppercase text-black hover:bg-[#A3CC00]"
                style={{ fontFamily: "'JetBrains Mono', monospace", boxShadow: '4px 4px 0 #000' }}
              >
                <DownloadSimple className="w-5 h-5" weight="bold" />
                DOWNLOAD
              </Button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-sm font-bold uppercase text-gray-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>UNSUPPORTED DOCUMENT TYPE</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 bg-white z-50 flex flex-col"
    >
      {/* Brutalist header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b-4 border-black bg-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 h-12 w-12 bg-black hover:bg-gray-800 border-3 border-black"
          style={{ boxShadow: '3px 3px 0 #000' }}
        >
          <ArrowLeft className="w-6 h-6 text-[#CCFF00]" weight="bold" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 
            className="font-black text-sm truncate text-black uppercase tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {document.title}
          </h1>
          <p 
            className="text-[10px] text-gray-600 uppercase tracking-wider font-bold"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {document.category} • {document.type.toUpperCase()}
          </p>
        </div>
      </header>

      <ScrollArea className="flex-1 bg-gray-100">
        <div className="px-5 py-8">
          {renderDocumentContent()}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
