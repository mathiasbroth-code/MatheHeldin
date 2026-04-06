import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { loadAllAufgaben } from './aufgaben';
import './styles/globals.css';

// Aufgabenbank im Hintergrund laden (blockiert nicht das Rendering)
loadAllAufgaben();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
