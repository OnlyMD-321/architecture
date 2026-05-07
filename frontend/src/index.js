/**
 * Point d'entrée React — Rendu de l'application
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const racine = ReactDOM.createRoot(document.getElementById('root'));
racine.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
