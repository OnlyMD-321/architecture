import React from 'react';
import { couleurs, polices, rayons, ombres } from '../../theme/tokens';

export default function CarteKPI({ titre, valeur, icone, couleurIcone = couleurs.primaire[600], couleurFond = couleurs.primaire[50] }) {
  return (
    <div style={{
      backgroundColor: couleurs.blanc,
      borderRadius: rayons.xl,
      boxShadow: ombres.sm,
      border: `1px solid ${couleurs.neutre[200]}`,
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: '48px', height: '48px',
        borderRadius: rayons.lg,
        backgroundColor: couleurFond,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        color: couleurIcone,
        fontSize: '22px',
      }}>
        {icone}
      </div>
      <div>
        <p style={{
          margin: 0,
          fontSize: polices.tailles.sm,
          color: couleurs.neutre[600],
          fontFamily: polices.famille,
          fontWeight: polices.graisses.moyen,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {titre}
        </p>
        <p style={{
          margin: '4px 0 0',
          fontSize: polices.tailles['3xl'],
          fontWeight: polices.graisses.gras,
          color: couleurs.neutre[900],
          fontFamily: polices.famille,
          lineHeight: 1,
        }}>
          {valeur}
        </p>
      </div>
    </div>
  );
}
