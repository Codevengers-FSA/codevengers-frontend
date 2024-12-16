import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';
import { WatchlistProvider } from './components/WatchlistContext';

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <WatchlistProvider>
     <App />
  </WatchlistProvider>,
  </HashRouter>
);