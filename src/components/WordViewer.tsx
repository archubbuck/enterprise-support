import { useState, useEffect, useRef } from 'react';
import { Spinner } from '@phosphor-icons/react';
import DOMPurify from 'dompurify';

interface WordViewerProps {
  fileUrl: string;
  title?: string;
  /** Called when the Word document fails to render in-page */
  onError?: () => void;
}

/**
 * Embedded Word document viewer.
 * Fetches the .docx as an ArrayBuffer, converts to HTML via mammoth (lazy-loaded),
 * sanitises output with DOMPurify, and renders inline.
 */
export function WordViewer({ fileUrl, title, onError }: WordViewerProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function convert() {
      try {
        // Lazy-load mammoth so it doesn't bloat the initial bundle
        const [mammoth, response] = await Promise.all([
          import('mammoth'),
          fetch(fileUrl),
        ]);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();

        const result = await mammoth.default.convertToHtml(
          { arrayBuffer },
          {
            // Preserve images as inline base64
            convertImage: mammoth.default.images.imgElement(function (image) {
              return image.read('base64').then(function (imageBuffer) {
                return { src: `data:${image.contentType};base64,${imageBuffer}` };
              });
            }),
          }
        );

        if (cancelled) return;

        if (result.messages.length > 0) {
          console.warn('mammoth conversion warnings:', result.messages);
        }

        // Sanitise the HTML with DOMPurify - enterprise-strict config
        const clean = DOMPurify.sanitize(result.value, {
          ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'hr',
            'ul', 'ol', 'li',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'strong', 'em', 'u', 's', 'sub', 'sup',
            'a', 'img', 'blockquote', 'pre', 'code', 'span',
          ],
          ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'colspan', 'rowspan'],
          ALLOW_DATA_ATTR: false,
        });

        setHtml(clean);
      } catch (err) {
        if (cancelled) return;
        console.error('Word viewer error:', err);
        setError('Unable to display this Word document in-app.');
        onError?.();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    convert();
    return () => { cancelled = true; };
  }, [fileUrl, onError]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Spinner className="w-8 h-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Converting document…</span>
      </div>
    );
  }

  if (error || !html) {
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
    <article
      ref={containerRef}
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
        prose-img:max-w-full prose-img:rounded-lg
      "
      dangerouslySetInnerHTML={{ __html: html }}
      aria-label={title ?? 'Word document'}
    />
  );
}
