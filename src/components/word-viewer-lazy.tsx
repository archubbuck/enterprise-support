import { lazy, Suspense } from 'react';
import { Spinner } from '@phosphor-icons/react';

const WordViewer = lazy(() =>
  import('./word-viewer').then((module) => ({ default: module.WordViewer }))
);

interface WordViewerLazyProps {
  fileUrl: string;
  title?: string;
  onError?: () => void;
}

export function WordViewerLazy({ fileUrl, title, onError }: WordViewerLazyProps) {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center bg-muted/30 rounded-lg"
          style={{ minHeight: '300px' }}
        >
          <div className="flex flex-col items-center gap-3">
            <Spinner className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading Word viewer…</span>
          </div>
        </div>
      }
    >
      <WordViewer fileUrl={fileUrl} title={title} onError={onError} />
    </Suspense>
  );
}
