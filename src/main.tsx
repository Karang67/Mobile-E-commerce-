import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker with automatic update reload support
if ('serviceWorker' in navigator) {
  let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined;
  updateSW = registerSW({
    onNeedRefresh() {
      console.log('[PWA] New version available, updating...');
      if (updateSW) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('[PWA] App is ready for offline browsing');
    },
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element with id "root"');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
