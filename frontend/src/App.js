/**
 * Composant racine de l'application React
 * Gestion des Ressources Matérielles — Interface principale
 *
 * Affiche en page unique :
 *   - L'inventaire des ressources matérielles
 *   - La liste des fournisseurs référencés (avec mise en évidence
 *     des fournisseurs en liste noire)
 */
import React from 'react';
import InventaireRessources from './components/InventaireRessources';
import ListeFournisseurs from './components/ListeFournisseurs';

function App() {
  return (
    <div style={styles.application}>
      {/* En-tête de l'application */}
      <header style={styles.entete}>
        <div style={styles.conteneurEntete}>
          <h1 style={styles.titreEntete}>
            🏢 Gestion des Ressources Matérielles
          </h1>
          <p style={styles.sousTitreEntete}>
            Système de suivi de l'inventaire, des fournisseurs et de la maintenance
          </p>
        </div>
      </header>

      {/* Contenu principal — Inventaire puis Fournisseurs */}
      <main style={styles.contenuPrincipal}>
        <InventaireRessources />
        <ListeFournisseurs />
      </main>

      {/* Pied de page */}
      <footer style={styles.piedDePage}>
        <p>© 2026 — Système de Gestion des Ressources Matérielles — Tous droits réservés</p>
      </footer>
    </div>
  );
}

/** Styles de l'application */
const styles = {
  application: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#edf2f7',
  },
  entete: {
    backgroundColor: '#1a365d',
    color: '#fff',
    padding: '20px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  conteneurEntete: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  titreEntete: {
    margin: '0 0 5px 0',
    fontSize: '24px',
    fontWeight: '700',
  },
  sousTitreEntete: {
    margin: 0,
    fontSize: '14px',
    opacity: 0.8,
  },
  contenuPrincipal: {
    flex: 1,
    padding: '20px 0',
  },
  piedDePage: {
    backgroundColor: '#2d3748',
    color: '#a0aec0',
    textAlign: 'center',
    padding: '15px',
    fontSize: '13px',
  },
};

export default App;
