import React from 'react';
import { couleurs, polices, rayons, ombres } from '../../theme/tokens';

export default function Carte({ titre, sousTitre, actions, padding = '24px', children, style = {} }) {
  return (
    <div style={{
      backgroundColor: couleurs.blanc,
      borderRadius: rayons.xl,
      boxShadow: ombres.sm,
      border: `1px solid ${couleurs.neutre[200]}`,
      overflow: 'hidden',
      ...style,
    }}>
      {(titre || actions) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `16px ${padding}`,
          borderBottom: `1px solid ${couleurs.neutre[100]}`,
        }}>
          <div>
            {titre && (
              <h2 style={{
                margin: 0,
                fontSize: polices.tailles.lg,
                fontWeight: polices.graisses.semi,
                color: couleurs.neutre[900],
                fontFamily: polices.famille,
              }}>
                {titre}
              </h2>
            )}
            {sousTitre && (
              <p style={{
                margin: '2px 0 0',
                fontSize: polices.tailles.sm,
                color: couleurs.neutre[600],
                fontFamily: polices.famille,
              }}>
                {sousTitre}
              </p>
            )}
          </div>
          {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
