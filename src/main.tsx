import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/theme'
import { queryClient } from '@/lib/query-client'
import App from './App'
import './index.css'

function renderApp() {
  const rootEl = document.getElementById('root')
  if (!rootEl) {
    console.error('[APP] Root element #root not found')
    return
  }
  createRoot(rootEl).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <ThemeProvider>
            <TooltipProvider>
              <App />
            </TooltipProvider>
          </ThemeProvider>
        </HashRouter>
      </QueryClientProvider>
    </StrictMode>,
  )
}

// Enable MSW mocks in dev mode if VITE_USE_MOCKS=true
async function enableMocks() {
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  console.info(`[APP] VITE_USE_MOCKS=${useMocks}`)

  if (!useMocks) {
    console.info('[APP] Running in API mode (real backend)')
    return
  }

  try {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      onUnhandledRequest: (request, print) => {
        // Only warn for API requests that don't have a handler
        if (request.url.includes('/api/')) {
          print.warning()
        }
      },
    })
    console.info('[MSW] Mock service worker started successfully')
  } catch (err) {
    console.error('[MSW] Failed to start mock service worker:', err)
    console.info('[APP] Continuing without mocks — API calls may fail')
  }
}

enableMocks()
  .then(() => {
    console.info('[APP] Rendering React application...')
    renderApp()
  })
  .catch((err) => {
    console.error('[APP] Critical error during initialization:', err)
    renderApp() // Try to render anyway
  })
