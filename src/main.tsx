import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './app.tsx'
import { ErrorFallback } from './error-fallback.tsx'
import { AppConfigProvider } from './hooks/use-app-config.tsx'

import "./main.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AppConfigProvider>
      <App />
    </AppConfigProvider>
   </ErrorBoundary>
)
