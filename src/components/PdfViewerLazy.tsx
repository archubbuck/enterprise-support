import { lazy, Suspense } from 'react';
import { Spinner } from '@phosphor-icons/react';

const PdfViewer = lazy(() =>
  import('./PdfViewer').then((module) => ({ default: module.PdfViewer }))
);

interface PdfViewerLazyProps {
  fileUrl: string;
  title?: string;
}

export function PdfViewerLazy({ fileUrl, title }: PdfViewerLazyProps) {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center bg-muted/30 rounded-lg"
          style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}
        >
          <div className="flex flex-col items-center gap-3">
            <Spinner className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading PDF viewer...</span>
          </div>
        </div>
      }
    >
      <PdfViewer fileUrl={fileUrl} title={title} />
    </Suspense>
  );
}
