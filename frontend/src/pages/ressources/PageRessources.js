import React, { useState, useCallback } from 'react';
import Carte from '../../components/shared/Carte';
import Tableau from '../../components/shared/Tableau';
import Badge, { ETATS_RESSOURCE, TYPES_RESSOURCE } from '../../components/shared/Badge';
import Bouton from '../../components/shared/Bouton';
import Select from '../../components/shared/Select';
import EtatVide from '../../components/shared/EtatVide';
import Toast from '../../components/shared/Toast';
import FormulaireRessource from './FormulaireRessource';
import ModalConfirmationSuppression from './ModalConfirmationSuppression';
import useApi from '../../hooks/useApi';
import useToast from '../../hooks/useToast';
import { recupererRessources } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import { couleurs, polices } from '../../theme/tokens';
import { MdAdd, MdEdit, MdDelete, MdComputer } from 'react-icons/md';

const OPTIONS_TYPE = [
  { valeur: '', libelle: 'Tous les types' },
  { valeur: 'ordinateur', libelle: 'Ordinateurs' },
  { valeur: 'imprimante', libelle: 'Imprimantes' },
];

function formatPrix(val) {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(val);
}

function afficherSpecs(ressource) {
  if (!ressource.specifications) return '—';
  const s = ressource.specifications;
  if (ressource.type === 'ordinateur') {
    return [s.cpu, s.ram, s.hdd].filter(Boolean).join(' · ') || '—';
  }
  if (ressource.type === 'imprimante') {
    return [s.vitesse_impression, s.resolution].filter(Boolean).join(' · ') || '—';
  }
  return '—';
}

const COLONNES = [
  { cle: 'nom', libelle: 'Ressource', rendu: (v, ligne) => (
    <div>
      <p style={{ margin: 0, fontWeight: 500, color: '#0f172a' }}>{v}</p>
      {ligne.marque && <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>{ligne.marque}</p>}
    </div>
  )},
  { cle: 'type', libelle: 'Type', rendu: (v) => {
    const d = TYPES_RESSOURCE[v];
    return d ? <Badge variante={d.variante} libelle={d.libelle} taille="sm" /> : v;
  }},
  { cle: 'prix_unitaire_mad', libelle: 'Prix', alignement: 'droite', rendu: (v) => (
    <span style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{formatPrix(v)}</span>
  )},
  { cle: 'specifications', libelle: 'Spécifications', rendu: (_, ligne) => (
    <span style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace' }}>{afficherSpecs(ligne)}</span>
  )},
  { cle: 'etat', libelle: 'État', rendu: (v) => {
    const d = ETATS_RESSOURCE[v];
    return d ? <Badge variante={d.variante} libelle={d.libelle} taille="sm" /> : v;
  }},
  { cle: 'fournisseur', libelle: 'Fournisseur', rendu: (v) => (
    <span style={{ fontSize: '13px', color: '#334155' }}>{v?.nom || '—'}</span>
  )},
];

export default function PageRessources() {
  const [filtreType, setFiltreType] = useState('');
  const [modalAjouter, setModalAjouter] = useState(false);
  const [ressourceEdition, setRessourceEdition] = useState(null);
  const [ressourceSuppression, setRessourceSuppression] = useState(null);
  const { toasts, ajouterToast, supprimerToast } = useToast();
  const { aLeDroit } = useAuth();
  const peutModifier = aLeDroit('admin', 'responsable');

  const charger = useCallback(() => recupererRessources(filtreType), [filtreType]);
  const { donnees, chargement, executer: recharger } = useApi(charger, { immediat: true });

  const ressources = donnees?.donnees || [];

  const onSucces = (msg) => {
    ajouterToast('succes', msg);
    recharger();
  };

  return (
    <>
      <Carte
        titre="Inventaire des ressources"
        sousTitre={`${ressources.length} ressource${ressources.length !== 1 ? 's' : ''} au total`}
        actions={
          <>
            <Select
              value={filtreType}
              onChange={e => setFiltreType(e.target.value)}
              options={OPTIONS_TYPE}
              style={{ width: '180px', fontSize: '13px' }}
            />
            {peutModifier && (
              <Bouton variante="primaire" icone={<MdAdd size={16} />} onClick={() => setModalAjouter(true)}>
                Nouvelle ressource
              </Bouton>
            )}
          </>
        }
      >
        <Tableau
          colonnes={COLONNES}
          donnees={ressources}
          chargement={chargement}
          etatVide={
            <EtatVide
              icone={<MdComputer />}
              titre="Aucune ressource"
              description="Commencez par ajouter votre première ressource matérielle."
              action={peutModifier && (
                <Bouton variante="primaire" icone={<MdAdd size={16} />} onClick={() => setModalAjouter(true)}>
                  Nouvelle ressource
                </Bouton>
              )}
            />
          }
          actions={peutModifier ? (ligne) => (
            <>
              <button
                title="Modifier"
                onClick={() => setRessourceEdition(ligne)}
                style={stylesActionBtn(couleurs.info[600])}
              >
                <MdEdit size={15} />
              </button>
              <button
                title="Supprimer"
                onClick={() => setRessourceSuppression(ligne)}
                style={stylesActionBtn(couleurs.danger[600])}
              >
                <MdDelete size={15} />
              </button>
            </>
          ) : null}
        />
      </Carte>

      <FormulaireRessource
        ouvert={modalAjouter || Boolean(ressourceEdition)}
        onFermer={() => { setModalAjouter(false); setRessourceEdition(null); }}
        onSucces={onSucces}
        ressource={ressourceEdition}
      />

      {ressourceSuppression && (
        <ModalConfirmationSuppression
          ouvert={Boolean(ressourceSuppression)}
          onFermer={() => setRessourceSuppression(null)}
          onSucces={onSucces}
          ressource={ressourceSuppression}
        />
      )}

      <Toast messages={toasts} onSupprimer={supprimerToast} />
    </>
  );
}

function stylesActionBtn(couleur) {
  return {
    background: 'none',
    border: `1px solid ${couleur}30`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: couleur,
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.15s',
  };
}
