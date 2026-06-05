import React from 'react';
import { couleurs, polices, rayons } from '../../theme/tokens';

const VARIANTES = {
  succes: { fond: couleurs.succes[100], texte: couleurs.succes[600] },
  danger: { fond: couleurs.danger[100], texte: couleurs.danger[600] },
  alerte: { fond: couleurs.alerte[100], texte: couleurs.alerte[600] },
  info:   { fond: couleurs.info[100],   texte: couleurs.info[600] },
  violet: { fond: couleurs.violet[100], texte: couleurs.violet[600] },
  neutre: { fond: couleurs.neutre[100], texte: couleurs.neutre[600] },
};

export const ETATS_RESSOURCE = {
  disponible: { variante: 'succes', libelle: 'Disponible' },
  en_service: { variante: 'info',   libelle: 'En service' },
  en_panne:   { variante: 'danger', libelle: 'En panne' },
  reforme:    { variante: 'neutre', libelle: 'Réformé' },
};

export const STATUTS_FOURNISSEUR = {
  actif:       { variante: 'succes', libelle: 'Actif' },
  liste_noire: { variante: 'danger', libelle: 'Liste noire' },
};

export const URGENCES = {
  basse:    { variante: 'neutre', libelle: 'Basse' },
  moyenne:  { variante: 'info',   libelle: 'Moyenne' },
  haute:    { variante: 'alerte', libelle: 'Haute' },
  critique: { variante: 'violet', libelle: 'Critique' },
};

export const FREQUENCES = {
  premiere_fois: { variante: 'neutre', libelle: 'Première fois' },
  occasionnelle: { variante: 'info',   libelle: 'Occasionnelle' },
  frequente:     { variante: 'alerte', libelle: 'Fréquente' },
  permanente:    { variante: 'danger', libelle: 'Permanente' },
};

export const NATURES = {
  materielle: { variante: 'alerte', libelle: 'Matérielle' },
  logicielle: { variante: 'info',   libelle: 'Logicielle' },
};

export const TYPES_RESSOURCE = {
  ordinateur: { variante: 'info',   libelle: 'Ordinateur' },
  imprimante: { variante: 'neutre', libelle: 'Imprimante' },
};

export default function Badge({ variante = 'neutre', libelle, taille = 'md' }) {
  const v = VARIANTES[variante] || VARIANTES.neutre;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: taille === 'sm' ? '2px 8px' : '3px 10px',
      borderRadius: rayons.complet,
      backgroundColor: v.fond,
      color: v.texte,
      fontSize: taille === 'sm' ? polices.tailles.xs : polices.tailles.sm,
      fontWeight: polices.graisses.semi,
      whiteSpace: 'nowrap',
      fontFamily: polices.famille,
    }}>
      {libelle}
    </span>
  );
}
