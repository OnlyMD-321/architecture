/**
 * Composant — Liste des Fournisseurs
 * ============================================================
 * Récupère et affiche les fournisseurs depuis l'API backend.
 * Met visuellement en évidence les fournisseurs sur liste noire
 * pour aider le Responsable des ressources à éviter de leur
 * attribuer de nouvelles offres.
 * ============================================================
 */
import React, { useEffect, useState } from 'react';
import { recupererFournisseurs } from '../services/apiService';

/** Libellés et couleurs pour le statut du fournisseur */
const LIBELLES_STATUT = {
  actif: { texte: '🟢 Actif', couleur: '#2f855a' },
  liste_noire: { texte: '🚫 Liste noire', couleur: '#c53030' },
};

function ListeFournisseurs() {
  /** État local — liste des fournisseurs */
  const [fournisseurs, setFournisseurs] = useState([]);

  /** Indicateurs d'état pour le rendu conditionnel */
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  /**
   * useEffect — récupère les fournisseurs au montage du composant.
   */
  useEffect(() => {
    async function chargerFournisseurs() {
      try {
        setChargement(true);
        const reponse = await recupererFournisseurs();
        setFournisseurs(reponse.donnees || []);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    }
    chargerFournisseurs();
  }, []);

  return (
    <section style={styles.conteneur}>
      <h2 style={styles.titre}>🏭 Fournisseurs référencés</h2>

      {erreur && <div style={styles.messageErreur}>⚠️ {erreur}</div>}

      {chargement ? (
        <p style={styles.chargement}>Chargement des fournisseurs…</p>
      ) : fournisseurs.length === 0 ? (
        <p style={styles.aucunResultat}>
          Aucun fournisseur enregistré pour le moment.
        </p>
      ) : (
        <table style={styles.tableau}>
          <thead>
            <tr style={styles.enTete}>
              <th style={styles.cellule}>ID</th>
              <th style={styles.cellule}>Nom</th>
              <th style={styles.cellule}>Ville</th>
              <th style={styles.cellule}>Site web</th>
              <th style={styles.cellule}>Responsable</th>
              <th style={styles.cellule}>Statut</th>
              <th style={styles.cellule}>Motif liste noire</th>
            </tr>
          </thead>
          <tbody>
            {fournisseurs.map((fournisseur) => {
              const statut =
                LIBELLES_STATUT[fournisseur.statut] || {
                  texte: fournisseur.statut,
                  couleur: '#4a5568',
                };
              return (
                <tr key={fournisseur.id}>
                  <td style={styles.cellule}>{fournisseur.id}</td>
                  <td style={styles.cellule}>{fournisseur.nom}</td>
                  <td style={styles.cellule}>{fournisseur.ville || '—'}</td>
                  <td style={styles.cellule}>
                    {fournisseur.site_web ? (
                      <a
                        href={fournisseur.site_web}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={styles.lien}
                      >
                        {fournisseur.site_web}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={styles.cellule}>
                    {fournisseur.nom_responsable || '—'}
                  </td>
                  <td style={{ ...styles.cellule, color: statut.couleur, fontWeight: 600 }}>
                    {statut.texte}
                  </td>
                  <td style={styles.cellule}>
                    {fournisseur.motif_liste_noire || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

/** Styles inline réutilisant la charte graphique du composant Inventaire */
const styles = {
  conteneur: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  titre: {
    color: '#1a365d',
    borderBottom: '3px solid #2b6cb0',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  tableau: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  enTete: {
    backgroundColor: '#2b6cb0',
    color: '#fff',
  },
  cellule: {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px',
  },
  lien: {
    color: '#2b6cb0',
    textDecoration: 'none',
  },
  chargement: {
    textAlign: 'center',
    color: '#718096',
    padding: '30px',
    fontSize: '16px',
  },
  aucunResultat: {
    textAlign: 'center',
    color: '#a0aec0',
    padding: '30px',
    fontSize: '16px',
  },
  messageErreur: {
    backgroundColor: '#fed7d7',
    color: '#9b2c2c',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontWeight: '500',
  },
};

export default ListeFournisseurs;
