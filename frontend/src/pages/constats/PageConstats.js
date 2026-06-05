import React, { useState, useCallback } from 'react';
import Carte from '../../components/shared/Carte';
import Tableau from '../../components/shared/Tableau';
import Badge, { URGENCES, FREQUENCES, NATURES } from '../../components/shared/Badge';
import Bouton from '../../components/shared/Bouton';
import Select from '../../components/shared/Select';
import EtatVide from '../../components/shared/EtatVide';
import Toast from '../../components/shared/Toast';
import FormulaireConstat from './FormulaireConstat';
import useApi from '../../hooks/useApi';
import useToast from '../../hooks/useToast';
import { recupererConstats } from '../../services/apiService';
import { MdAdd, MdWarning } from 'react-icons/md';

const OPTIONS_URGENCE = [
  { valeur: '', libelle: 'Toutes les urgences' },
  { valeur: 'critique', libelle: 'Critique' },
  { valeur: 'haute',    libelle: 'Haute' },
  { valeur: 'moyenne',  libelle: 'Moyenne' },
  { valeur: 'basse',    libelle: 'Basse' },
];

const OPTIONS_NATURE = [
  { valeur: '', libelle: 'Toutes les natures' },
  { valeur: 'materielle', libelle: 'Matérielle' },
  { valeur: 'logicielle', libelle: 'Logicielle' },
];

function formatDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const COLONNES = [
  { cle: 'ressource', libelle: 'Ressource', rendu: (v, ligne) => (
    <div>
      <p style={{ margin: 0, fontWeight: 500, color: '#0f172a' }}>{v?.nom || `#${ligne.ressource_id}`}</p>
      {v?.marque && <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>{v.marque}</p>}
    </div>
  )},
  { cle: 'date_constat', libelle: 'Date', rendu: formatDate },
  { cle: 'nature_panne', libelle: 'Nature', rendu: v => {
    const d = NATURES[v];
    return d ? <Badge variante={d.variante} libelle={d.libelle} taille="sm" /> : v;
  }},
  { cle: 'description', libelle: 'Description', rendu: v => (
    <span style={{ fontSize: '13px', color: '#475569' }}>
      {v?.length > 60 ? v.slice(0, 60) + '…' : v}
    </span>
  )},
  { cle: 'frequence', libelle: 'Fréquence', rendu: v => {
    const d = FREQUENCES[v];
    return d ? <Badge variante={d.variante} libelle={d.libelle} taille="sm" /> : v;
  }},
  { cle: 'urgence', libelle: 'Urgence', rendu: v => {
    const d = URGENCES[v];
    return d ? <Badge variante={d.variante} libelle={d.libelle} taille="sm" /> : v;
  }},
];

export default function PageConstats() {
  const [filtreUrgence, setFiltreUrgence] = useState('');
  const [filtreNature, setFiltreNature] = useState('');
  const [modalAjouter, setModalAjouter] = useState(false);
  const { toasts, ajouterToast, supprimerToast } = useToast();

  const charger = useCallback(() => recupererConstats(), []);
  const { donnees, chargement, executer: recharger } = useApi(charger, { immediat: true });

  const tousLesConstats = donnees?.donnees || [];

  const constats = tousLesConstats.filter(c => {
    if (filtreUrgence && c.urgence !== filtreUrgence) return false;
    if (filtreNature && c.nature_panne !== filtreNature) return false;
    return true;
  });

  const onSucces = (msg) => {
    ajouterToast('succes', msg);
    recharger();
  };

  return (
    <>
      <Carte
        titre="Constats de panne"
        sousTitre={`${constats.length} constat${constats.length !== 1 ? 's' : ''} affiché${constats.length !== 1 ? 's' : ''}`}
        actions={
          <>
            <Select value={filtreNature} onChange={e => setFiltreNature(e.target.value)}
              options={OPTIONS_NATURE} style={{ width: '180px', fontSize: '13px' }} />
            <Select value={filtreUrgence} onChange={e => setFiltreUrgence(e.target.value)}
              options={OPTIONS_URGENCE} style={{ width: '180px', fontSize: '13px' }} />
            <Bouton variante="primaire" icone={<MdAdd size={16} />} onClick={() => setModalAjouter(true)}>
              Nouveau constat
            </Bouton>
          </>
        }
      >
        <Tableau
          colonnes={COLONNES}
          donnees={constats}
          chargement={chargement}
          etatVide={
            <EtatVide
              icone={<MdWarning />}
              titre="Aucun constat de panne"
              description="Aucun constat enregistré pour les filtres sélectionnés."
              action={
                <Bouton variante="primaire" icone={<MdAdd size={16} />} onClick={() => setModalAjouter(true)}>
                  Nouveau constat
                </Bouton>
              }
            />
          }
        />
      </Carte>

      <FormulaireConstat
        ouvert={modalAjouter}
        onFermer={() => setModalAjouter(false)}
        onSucces={onSucces}
      />

      <Toast messages={toasts} onSupprimer={supprimerToast} />
    </>
  );
}
