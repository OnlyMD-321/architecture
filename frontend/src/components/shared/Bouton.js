import React, { useState } from 'react';
import { couleurs, polices, rayons, ombres } from '../../theme/tokens';

const VARIANTES = {
  primaire: {
    fond: couleurs.primaire[600],
    fondSurvol: couleurs.primaire[700],
    texte: '#fff',
    bordure: 'transparent',
  },
  secondaire: {
    fond: couleurs.blanc,
    fondSurvol: couleurs.neutre[50],
    texte: couleurs.neutre[700],
    bordure: couleurs.neutre[200],
  },
  danger: {
    fond: couleurs.danger[600],
    fondSurvol: '#b91c1c',
    texte: '#fff',
    bordure: 'transparent',
  },
  fantome: {
    fond: 'transparent',
    fondSurvol: couleurs.danger[100],
    texte: couleurs.danger[600],
    bordure: couleurs.danger[600],
  },
  fantomeNeutre: {
    fond: 'transparent',
    fondSurvol: couleurs.neutre[100],
    texte: couleurs.neutre[600],
    bordure: couleurs.neutre[200],
  },
};

const TAILLES = {
  sm: { padding: '6px 12px', fontSize: polices.tailles.sm },
  md: { padding: '8px 16px', fontSize: polices.tailles.base },
  lg: { padding: '10px 20px', fontSize: polices.tailles.md },
};

export default function Bouton({
  variante = 'primaire',
  taille = 'md',
  icone,
  chargement = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
  style = {},
}) {
  const [survol, setSurvol] = useState(false);
  const v = VARIANTES[variante] || VARIANTES.primaire;
  const t = TAILLES[taille] || TAILLES.md;
  const estDesactive = disabled || chargement;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={estDesactive}
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => setSurvol(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: t.padding,
        fontSize: t.fontSize,
        fontWeight: polices.graisses.semi,
        fontFamily: polices.famille,
        color: v.texte,
        backgroundColor: survol && !estDesactive ? v.fondSurvol : v.fond,
        border: `1px solid ${v.bordure}`,
        borderRadius: rayons.md,
        cursor: estDesactive ? 'not-allowed' : 'pointer',
        opacity: estDesactive ? 0.6 : 1,
        transition: 'background-color 0.15s, box-shadow 0.15s',
        boxShadow: variante === 'primaire' ? ombres.sm : 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {chargement ? (
        <span style={{
          width: '14px', height: '14px',
          border: `2px solid ${v.texte}40`,
          borderTopColor: v.texte,
          borderRadius: '50%',
          animation: 'tourner 0.7s linear infinite',
          display: 'inline-block',
          flexShrink: 0,
        }} />
      ) : icone ? (
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icone}</span>
      ) : null}
      {children}
      <style>{`@keyframes tourner { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
