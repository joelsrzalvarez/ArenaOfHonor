import React from 'react';
import { createRoot } from 'react-dom/client';  
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { LayoutProvider } from './LayoutContext';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); 

root.render(
  <LayoutProvider>
    <Router>  
        <App />
    </Router>
  </LayoutProvider>
);
