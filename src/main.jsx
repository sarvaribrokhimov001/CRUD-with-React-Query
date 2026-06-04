import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider , QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions : {
    queries : {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      retry: 3,
    }
  }
});

createRoot(document.getElementById('root')).render(
<QueryClientProvider client={queryClient}>
  <App />
  <Toaster position="top-right" />
</QueryClientProvider>
)