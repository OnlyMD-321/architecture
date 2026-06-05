import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import DispositionPrincipale from './components/layout/DispositionPrincipale';
import TableauDeBord from './pages/TableauDeBord';
import PageRessources from './pages/ressources/PageRessources';
import PageFournisseurs from './pages/fournisseurs/PageFournisseurs';
import PageConstats from './pages/constats/PageConstats';
import PageConnexion from './pages/PageConnexion';
import { polices } from './theme/tokens';

function RouteProtegee({ children }) {
  const { estAuthentifie } = useAuth();
  return estAuthentifie ? children : <Navigate to="/connexion" replace />;
}

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
        <Route path="/connexion" element={<PageConnexion />} />
        <Route path="/" element={<RouteProtegee><DispositionPrincipale /></RouteProtegee>}>
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
