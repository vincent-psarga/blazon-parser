import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BlazonPage } from '../src/infra/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlazonPage />
  </StrictMode>
);
