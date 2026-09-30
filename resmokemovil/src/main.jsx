import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.MODE === 'production',
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    beforeSend(event) {
      try {
        const message = String(event?.message || '').toLowerCase()
        const values = event?.exception?.values || []
        const exceptionMessage = values.map((v) => String(v?.value || '')).join(' ').toLowerCase()
        if (message.includes('chunkloaderror') || exceptionMessage.includes('chunkloaderror')) return null
      } catch {}
      return event
    }
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Sentry.ErrorBoundary fallback={null}>
        <App />
      </Sentry.ErrorBoundary>
    </HelmetProvider>
  </StrictMode>
)
