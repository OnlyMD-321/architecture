import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import CarteKPI from '../components/shared/CarteKPI';
import Carte from '../components/shared/Carte';
import Tableau from '../components/shared/Tableau';
import Badge, { ETATS_RESSOURCE, URGENCES, NATURES } from '../components/shared/Badge';
import Bouton from '../components/shared/Bouton';
import useApi from '../hooks/useApi';
import { recupererRessources, recupererFournisseurs, recupererConstats } from '../services/apiService';
import { couleurs } from '../theme/tokens';
import {
  MdComputer, MdWarning, MdBusinessCenter, MdErrorOutline,
  MdArrowForward,
} from 'react-icons/md';

function formatDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const COLONNES_PANNES = [
  { cle: 'ressource', libelle: 'Ressource', rendu: (v, ligne) => (
    <span style={{ fontWeight: 500, color: '#0f172a' }}>{v?.nom || `#${ligne.ressource_id}`}</span>
  )},
  { cle: 'date_constat', libelle: 'Date', rendu: formatDate },
  { cle: 'nature_panne', libelle: 'Nature', rendu: v => {
    const d = NATURES[v];
    return d ? <Badge variante={d.variante} libelle={d.libelle} taille="sm" /> : v;
  }},
  { cle: 'urgence', libelle: 'Urgence', rendu: v => {
    const d = URGENCES[v];
    return d ? <Badge variante={d.variante} libelle={d.libelle} taille="sm" /> : v;
  }},
];

const COLONNES_RESSOURCES_PANNES = [
  { cle: 'nom', libelle: 'Ressource', rendu: (v, ligne) => (
    <div>
      <p style={{ margin: 0, fontWeight: 500, color: '#0f172a' }}>{v}</p>
      {ligne.marque && <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>{ligne.marque}</p>}
    </div>
  )},
  { cle: 'etat', libelle: 'État', rendu: v => {
    const d = ETATS_RESSOURCE[v];
    return d ? <Badge variante={d.variante} libelle={d.libelle} taille="sm" /> : v;
  }},
  { cle: 'fournisseur', libelle: 'Fournisseur', rendu: v => v?.nom || '—' },
];

export default function TableauDeBord() {
  const chargerRessources   = useCallback(() => recupererRessources(), []);
  const chargerFournisseurs = useCallback(() => recupererFournisseurs(), []);
  const chargerConstats     = useCallback(() => recupererConstats(), []);

  const { donnees: dRessources }   = useApi(chargerRessources,   { immediat: true });
  const { donnees: dFournisseurs } = useApi(chargerFournisseurs, { immediat: true });
  const { donnees: dConstats }     = useApi(chargerConstats,     { immediat: true });

  const ressources   = dRessources?.donnees   || [];
  const fournisseurs = dFournisseurs?.donnees  || [];
  const constats     = dConstats?.donnees      || [];

  const totalRessources      = ressources.length;
  const ressourcesEnPanne    = ressources.filter(r => r.etat === 'en_panne');
  const fournisseursActifs   = fournisseurs.filter(f => f.statut === 'actif').length;
  const constatsCritiques    = constats.filter(c => c.urgence === 'critique').length;

  const cinqDerniersConstats    = constats.slice(0, 5);
  const cinqRessourcesEnPanne   = ressourcesEnPanne.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <CarteKPI
          titre="Total ressources"
          valeur={totalRessources}
          icone={<MdComputer />}
          couleurIcone={couleurs.primaire[600]}
          couleurFond={couleurs.primaire[50]}
        />
        <CarteKPI
          titre="Ressources en panne"
          valeur={ressourcesEnPanne.length}
          icone={<MdErrorOutline />}
          couleurIcone={couleurs.danger[600]}
          couleurFond={couleurs.danger[100]}
        />
        <CarteKPI
          titre="Fournisseurs actifs"
          valeur={fournisseursActifs}
          icone={<MdBusinessCenter />}
          couleurIcone={couleurs.succes[600]}
          couleurFond={couleurs.succes[100]}
        />
        <CarteKPI
          titre="Constats critiques"
          valeur={constatsCritiques}
          icone={<MdWarning />}
          couleurIcone={couleurs.violet[600]}
          couleurFond={couleurs.violet[100]}
        />
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        <Carte
          titre="Pannes récentes"
          sousTitre="5 derniers constats enregistrés"
          actions={
            <Link to="/constats" style={{ textDecoration: 'none' }}>
              <Bouton variante="fantomeNeutre" taille="sm" icone={<MdArrowForward size={14} />}>Voir tout</Bouton>
            </Link>
          }
        >
          <Tableau
            colonnes={COLONNES_PANNES}
            donnees={cinqDerniersConstats}
            chargement={!dConstats}
          />
        </Carte>

        <Carte
          titre="Ressources en panne"
          sousTitre={`${ressourcesEnPanne.length} ressource${ressourcesEnPanne.length !== 1 ? 's' : ''} nécessitent une intervention`}
          actions={
            <Link to="/ressources" style={{ textDecoration: 'none' }}>
              <Bouton variante="fantomeNeutre" taille="sm" icone={<MdArrowForward size={14} />}>Voir tout</Bouton>
            </Link>
          }
        >
          <Tableau
            colonnes={COLONNES_RESSOURCES_PANNES}
            donnees={cinqRessourcesEnPanne}
            chargement={!dRessources}
          />
        </Carte>
      </div>
    </div>
  );
}
