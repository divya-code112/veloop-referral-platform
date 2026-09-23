import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource-variable/sora/wght.css';
import '@fontsource-variable/inter/wght.css';

import 'bootstrap/dist/css/bootstrap-grid.min.css';
import './styles/global.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
