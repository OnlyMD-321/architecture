import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DispositionPrincipale from './components/layout/DispositionPrincipale';
import TableauDeBord from './pages/TableauDeBord';
import PageRessources from './pages/ressources/PageRessources';
import PageFournisseurs from './pages/fournisseurs/PageFournisseurs';
import PageConstats from './pages/constats/PageConstats';
import { polices } from './theme/tokens';

export default function App() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; font-family: ${polices.famille}; }
        a { color: inherit; }
        input:focus, select:focus, textarea:focus {
          outline: 2px solid #2b6cb0;
          outline-offset: 1px;
        }
      `}</style>
      <Routes>
        <Route path="/" element={<DispositionPrincipale />}>
          <Route index element={<Navigate to="/tableau-de-bord" replace />} />
          <Route path="tableau-de-bord" element={<TableauDeBord />} />
          <Route path="ressources"      element={<PageRessources />} />
          <Route path="fournisseurs"    element={<PageFournisseurs />} />
          <Route path="constats"        element={<PageConstats />} />
        </Route>
        <Route path="*" element={<Navigate to="/tableau-de-bord" replace />} />
      </Routes>
    </>
  );
}
