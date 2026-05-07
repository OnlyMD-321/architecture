/**
 * Composant principal — Inventaire des Ressources Matérielles
 * Utilise les hooks useState et useEffect pour la gestion d'état
 * et le chargement des données depuis l'API backend.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { recupererRessources, creerRessource } from '../services/apiService';

/** Libellés traduits pour l'affichage des états */
const LIBELLES_ETAT = {
  disponible: '🟢 Disponible',
  en_service: '🔵 En service',
  en_panne: '🔴 En panne',
  reforme: '⚫ Réformé',
};

/** Libellés traduits pour les types de ressource */
const LIBELLES_TYPE = {
  ordinateur: '💻 Ordinateur',
  imprimante: '🖨️ Imprimante',
};

/**
 * Composant fonctionnel affichant l'inventaire matériel.
 * Permet le filtrage par type et l'ajout de nouvelles ressources.
 */
function InventaireRessources() {
  /** État local — liste des ressources récupérées depuis l'API */
  const [ressources, setRessources] = useState([]);

  /** État local — indicateur de chargement */
  const [chargement, setChargement] = useState(true);

  /** État local — message d'erreur éventuel */
  const [erreur, setErreur] = useState(null);

  /** État local — filtre par type de ressource */
  const [filtreType, setFiltreType] = useState('');

  /** État local — visibilité du formulaire d'ajout */
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  /** État local — message de succès après création */
  const [messageSucces, setMessageSucces] = useState('');

  /**
   * Charge les ressources depuis l'API backend.
   * Utilise useCallback pour mémoriser la fonction.
   */
  const chargerRessources = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);
      const reponse = await recupererRessources(filtreType);
      setRessources(reponse.donnees || []);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }, [filtreType]);

  /**
   * useEffect — Chargement initial et rechargement lors du changement de filtre.
   * Se déclenche au montage du composant et à chaque modification du filtreType.
   */
  useEffect(() => {
    chargerRessources();
  }, [chargerRessources]);

  /**
   * Gère la soumission du formulaire d'ajout de ressource.
   * @param {object} donneesFormulaire - Données saisies par l'utilisateur
   */
  const gererAjoutRessource = async (donneesFormulaire) => {
    try {
      setErreur(null);
      await creerRessource(donneesFormulaire);
      setMessageSucces('Ressource ajoutée avec succès !');
      setAfficherFormulaire(false);
      /** Rechargement de la liste après ajout */
      await chargerRessources();
      setTimeout(() => setMessageSucces(''), 3000);
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <div style={styles.conteneur}>
      <h2 style={styles.titre}>📦 Inventaire des Ressources Matérielles</h2>

      {/* Barre d'actions : filtre et bouton d'ajout */}
      <div style={styles.barreActions}>
        <div style={styles.groupeFiltres}>
          <label htmlFor="filtre-type" style={styles.label}>
            Filtrer par type :
          </label>
          <select
            id="filtre-type"
            value={filtreType}
            onChange={(e) => setFiltreType(e.target.value)}
            style={styles.select}
          >
            <option value="">Tous les types</option>
            <option value="ordinateur">Ordinateurs</option>
            <option value="imprimante">Imprimantes</option>
          </select>
        </div>
        <button
          onClick={() => setAfficherFormulaire(!afficherFormulaire)}
          style={styles.boutonAjouter}
        >
          {afficherFormulaire ? '✕ Annuler' : '＋ Nouvelle ressource'}
        </button>
      </div>

      {/* Messages de succès et d'erreur */}
      {messageSucces && <div style={styles.messageSucces}>{messageSucces}</div>}
      {erreur && <div style={styles.messageErreur}>⚠️ {erreur}</div>}

      {/* Formulaire d'ajout conditionnel */}
      {afficherFormulaire && (
        <FormulaireRessource onSoumettre={gererAjoutRessource} />
      )}

      {/* Indicateur de chargement */}
      {chargement ? (
        <p style={styles.chargement}>Chargement des ressources…</p>
      ) : ressources.length === 0 ? (
        <p style={styles.aucunResultat}>Aucune ressource trouvée.</p>
      ) : (
        /* Tableau de l'inventaire */
        <table style={styles.tableau}>
          <thead>
            <tr style={styles.enTete}>
              <th style={styles.cellule}>ID</th>
              <th style={styles.cellule}>Nom</th>
              <th style={styles.cellule}>Type</th>
              <th style={styles.cellule}>Marque</th>
              <th style={styles.cellule}>Prix (MAD)</th>
              <th style={styles.cellule}>Spécifications</th>
              <th style={styles.cellule}>État</th>
              <th style={styles.cellule}>Fournisseur</th>
            </tr>
          </thead>
          <tbody>
            {ressources.map((ressource) => (
              <tr key={ressource.id} style={styles.ligne}>
                <td style={styles.cellule}>{ressource.id}</td>
                <td style={styles.cellule}>{ressource.nom}</td>
                <td style={styles.cellule}>
                  {LIBELLES_TYPE[ressource.type] || ressource.type}
                </td>
                <td style={styles.cellule}>{ressource.marque || '—'}</td>
                <td style={styles.cellulePrix}>
                  {parseFloat(ressource.prix_unitaire_mad).toLocaleString('fr-MA')} MAD
                </td>
                <td style={styles.cellule}>
                  <AfficherSpecifications
                    type={ressource.type}
                    specifications={ressource.specifications}
                  />
                </td>
                <td style={styles.cellule}>
                  {LIBELLES_ETAT[ressource.etat] || ressource.etat}
                </td>
                <td style={styles.cellule}>
                  {ressource.fournisseur ? ressource.fournisseur.nom : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={styles.compteur}>
        Total : <strong>{ressources.length}</strong> ressource(s)
      </p>
    </div>
  );
}

/**
 * Sous-composant — Affiche les spécifications techniques selon le type.
 */
function AfficherSpecifications({ type, specifications }) {
  if (!specifications) return <span>—</span>;

  if (type === 'ordinateur') {
    return (
      <span>
        CPU: {specifications.cpu} | RAM: {specifications.ram} | HDD: {specifications.hdd}
      </span>
    );
  }
  if (type === 'imprimante') {
    return (
      <span>
        Vitesse: {specifications.vitesse_impression} | Résolution: {specifications.resolution}
      </span>
    );
  }
  return <span>—</span>;
}

/**
 * Sous-composant — Formulaire d'ajout d'une nouvelle ressource.
 * Adapte dynamiquement les champs selon le type sélectionné.
 */
function FormulaireRessource({ onSoumettre }) {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    type: 'ordinateur',
    marque: '',
    prix_unitaire_mad: '',
    cpu: '',
    ram: '',
    hdd: '',
    vitesse_impression: '',
    resolution: '',
  });

  const gererChangement = (e) => {
    const { name, value } = e.target;
    setFormulaire((prev) => ({ ...prev, [name]: value }));
  };

  const gererSoumission = (e) => {
    e.preventDefault();
    onSoumettre({
      ...formulaire,
      prix_unitaire_mad: parseFloat(formulaire.prix_unitaire_mad),
    });
  };

  return (
    <form onSubmit={gererSoumission} style={styles.formulaire}>
      <h3 style={styles.sousTitre}>Ajouter une ressource</h3>
      <div style={styles.grille}>
        <div style={styles.champGroupe}>
          <label style={styles.label}>Nom *</label>
          <input
            name="nom"
            value={formulaire.nom}
            onChange={gererChangement}
            required
            style={styles.input}
            placeholder="Ex: Dell Latitude 5520"
          />
        </div>
        <div style={styles.champGroupe}>
          <label style={styles.label}>Type *</label>
          <select
            name="type"
            value={formulaire.type}
            onChange={gererChangement}
            style={styles.select}
          >
            <option value="ordinateur">Ordinateur</option>
            <option value="imprimante">Imprimante</option>
          </select>
        </div>
        <div style={styles.champGroupe}>
          <label style={styles.label}>Marque</label>
          <input
            name="marque"
            value={formulaire.marque}
            onChange={gererChangement}
            style={styles.input}
            placeholder="Ex: Dell, HP, Canon"
          />
        </div>
        <div style={styles.champGroupe}>
          <label style={styles.label}>Prix unitaire (MAD) *</label>
          <input
            name="prix_unitaire_mad"
            type="number"
            min="0"
            step="0.01"
            value={formulaire.prix_unitaire_mad}
            onChange={gererChangement}
            required
            style={styles.input}
            placeholder="Ex: 8500.00"
          />
        </div>
      </div>

      {/* Champs conditionnels selon le type sélectionné */}
      {formulaire.type === 'ordinateur' && (
        <div style={styles.grille}>
          <div style={styles.champGroupe}>
            <label style={styles.label}>Processeur (CPU) *</label>
            <input
              name="cpu"
              value={formulaire.cpu}
              onChange={gererChangement}
              required
              style={styles.input}
              placeholder="Ex: Intel Core i7-12700H"
            />
          </div>
          <div style={styles.champGroupe}>
            <label style={styles.label}>Mémoire RAM *</label>
            <input
              name="ram"
              value={formulaire.ram}
              onChange={gererChangement}
              required
              style={styles.input}
              placeholder="Ex: 16 Go DDR5"
            />
          </div>
          <div style={styles.champGroupe}>
            <label style={styles.label}>Disque dur (HDD/SSD) *</label>
            <input
              name="hdd"
              value={formulaire.hdd}
              onChange={gererChangement}
              required
              style={styles.input}
              placeholder="Ex: 512 Go SSD NVMe"
            />
          </div>
        </div>
      )}

      {formulaire.type === 'imprimante' && (
        <div style={styles.grille}>
          <div style={styles.champGroupe}>
            <label style={styles.label}>Vitesse d'impression *</label>
            <input
              name="vitesse_impression"
              value={formulaire.vitesse_impression}
              onChange={gererChangement}
              required
              style={styles.input}
              placeholder="Ex: 30 pages/min"
            />
          </div>
          <div style={styles.champGroupe}>
            <label style={styles.label}>Résolution *</label>
            <input
              name="resolution"
              value={formulaire.resolution}
              onChange={gererChangement}
              required
              style={styles.input}
              placeholder="Ex: 1200x1200 dpi"
            />
          </div>
        </div>
      )}

      <button type="submit" style={styles.boutonSoumettre}>
        ✓ Enregistrer la ressource
      </button>
    </form>
  );
}

/* ============================================================
 * STYLES — Styles en ligne pour le prototype
 * ============================================================ */
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
  barreActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  groupeFiltres: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '14px',
    marginBottom: '4px',
    display: 'block',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '14px',
    backgroundColor: '#fff',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  },
  boutonAjouter: {
    padding: '10px 20px',
    backgroundColor: '#2b6cb0',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  boutonSoumettre: {
    padding: '10px 24px',
    backgroundColor: '#38a169',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '10px',
  },
  messageSucces: {
    backgroundColor: '#c6f6d5',
    color: '#22543d',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontWeight: '500',
  },
  messageErreur: {
    backgroundColor: '#fed7d7',
    color: '#9b2c2c',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontWeight: '500',
  },
  formulaire: {
    backgroundColor: '#f7fafc',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px',
  },
  sousTitre: {
    color: '#2d3748',
    marginBottom: '15px',
    fontSize: '16px',
  },
  grille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px',
    marginBottom: '10px',
  },
  champGroupe: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
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
  cellulePrix: {
    padding: '12px 15px',
    textAlign: 'right',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2b6cb0',
  },
  ligne: {
    transition: 'background-color 0.2s',
  },
  chargement: {
    textAlign: 'center',
    color: '#718096',
    padding: '40px',
    fontSize: '16px',
  },
  aucunResultat: {
    textAlign: 'center',
    color: '#a0aec0',
    padding: '40px',
    fontSize: '16px',
  },
  compteur: {
    textAlign: 'right',
    color: '#718096',
    marginTop: '10px',
    fontSize: '14px',
  },
};

export default InventaireRessources;
