import { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useGesture } from '@use-gesture/react';
import { Spinner } from '@phosphor-icons/react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Self-host PDF.js worker for offline support and strict CSP compliance
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

interface PdfViewerProps {
  fileUrl: string;
  title?: string;
  /** Called when the PDF fails to load */
  onError?: () => void;
}

/**
 * Incrementally-rendered PDF viewer.
 * Only pages within viewport ± 1-page buffer are rendered; the rest are
 * lightweight placeholder divs observed by IntersectionObserver.
 */
export function PdfViewer({ fileUrl, onError }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1, 2]));
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const pageWidth = Math.min((containerRef.current?.clientWidth ?? 400), 600) - 32;
  // Approximate page height for placeholder sizing (A4 aspect ratio)
  const placeholderHeight = Math.round(pageWidth * 1.414);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
    // Pre-render first 2 pages for immediate display
    setVisiblePages(new Set([1, Math.min(2, numPages)]));
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF. Please try opening it externally.');
    onError?.();
  }, [onError]);

  // IntersectionObserver to track which pages are in/near the viewport
  useEffect(() => {
    if (!numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisiblePages((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const pageNum = Number(entry.target.getAttribute('data-page'));
            if (!pageNum) continue;
            if (entry.isIntersecting) {
              // Add this page and 1-page buffer above/below
              next.add(pageNum);
              if (pageNum > 1) next.add(pageNum - 1);
              if (pageNum < numPages) next.add(pageNum + 1);
            }
            // We intentionally never remove pages from the set so that
            // already-rendered pages stay rendered while scrolling back.
          }
          if (next.size === prev.size) return prev; // avoid re-render
          return next;
        });
      },
      {
        root: containerRef.current,
        rootMargin: '200px 0px', // render slightly before entering viewport
      }
    );

    pageRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [numPages]);

  // Pinch-to-zoom gesture handling
  useGesture(
    {
      onPinch: ({ offset: [s], memo }) => {
        const newScale = Math.min(Math.max(s, 0.5), 3);
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
              Array.from({ length: numPages }, (_, index) => {
                const pageNumber = index + 1;
                const shouldRender = visiblePages.has(pageNumber);

                return (
                  <div
                    key={`page_${pageNumber}`}
                    ref={(el) => {
                      if (el) pageRefs.current.set(pageNumber, el);
                    }}
                    data-page={pageNumber}
                    style={{ minHeight: shouldRender ? undefined : placeholderHeight }}
                  >
                    {shouldRender ? (
                      <Page
                        pageNumber={pageNumber}
                        className="shadow-md rounded-lg overflow-hidden"
                        width={pageWidth}
                        loading={
                          <div
                            className="flex items-center justify-center bg-muted/50 rounded-lg"
                            style={{ width: pageWidth, height: placeholderHeight }}
                          >
                            <Spinner className="w-6 h-6 animate-spin text-muted-foreground" />
                          </div>
                        }
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center bg-muted/20 rounded-lg border border-border/30"
                        style={{ width: pageWidth, height: placeholderHeight }}
                      >
                        <span className="text-xs text-muted-foreground">Page {pageNumber}</span>
                      </div>
                    )}
                  </div>
                );
              })}
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
