import { useState, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useGesture } from '@use-gesture/react';
import { Spinner } from '@phosphor-icons/react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  title?: string;
}

export function PdfViewer({ fileUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF. Please try opening it externally.');
  }, []);

  // Pinch-to-zoom gesture handling
  useGesture(
    {
      onPinch: ({ offset: [s], memo }) => {
        const newScale = Math.min(Math.max(s, 0.5), 3); // Clamp between 0.5x and 3x
        setScale(newScale);
        return memo;
      },
      onDrag: ({ offset: [x, y] }) => {
        if (scale > 1) {
          setPosition({ x, y });
        }
      },
    },
    {
      target: containerRef,
      pinch: { scaleBounds: { min: 0.5, max: 3 } },
      drag: { enabled: scale > 1 },
    }
  );

  // Reset zoom
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Zoom controls */}
      {scale !== 1 && (
        <button
          onClick={resetZoom}
          className="absolute top-2 right-2 z-10 px-3 py-1.5 text-xs font-medium bg-background/90 border border-border rounded-full shadow-sm hover:bg-muted transition-colors"
        >
          Reset Zoom ({Math.round(scale * 100)}%)
        </button>
      )}

      {/* PDF container with touch gestures */}
      <div
        ref={containerRef}
        className="overflow-auto touch-pan-x touch-pan-y"
        style={{
          height: 'calc(100vh - 200px)',
          minHeight: '400px',
        }}
      >
        <div
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'top center',
            transition: scale === 1 ? 'transform 0.2s ease-out' : 'none',
          }}
        >
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center py-12">
                <Spinner className="w-8 h-8 animate-spin text-primary" />
              </div>
            }
            className="flex flex-col items-center gap-4 pb-4"
          >
            {numPages &&
              Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  className="shadow-md rounded-lg overflow-hidden"
                  width={Math.min(containerRef.current?.clientWidth ?? 400, 600) - 32}
                  loading={
                    <div className="flex items-center justify-center bg-muted/50 rounded-lg" style={{ width: 368, height: 520 }}>
                      <Spinner className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  }
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              ))}
          </Document>
        </div>
      </div>

      {/* Page count indicator */}
      {numPages && (
        <div className="text-center py-2 text-xs text-muted-foreground">
          {numPages} {numPages === 1 ? 'page' : 'pages'}
        </div>
      )}
    </div>
  );
}
