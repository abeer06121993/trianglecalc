import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;
const prerenderedYear = Number(rootElement.dataset.prerenderedYear);
const app = (
  <StrictMode>
    <App prerenderedYear={Number.isInteger(prerenderedYear) ? prerenderedYear : undefined} />
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
