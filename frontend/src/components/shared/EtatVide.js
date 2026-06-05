import React from 'react';
import { couleurs, polices } from '../../theme/tokens';

export default function EtatVide({ icone, titre, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      {icone && (
        <div style={{ fontSize: '40px', color: couleurs.neutre[400], marginBottom: '12px' }}>
          {icone}
        </div>
      )}
      <p style={{
        margin: '0 0 6px',
        fontSize: polices.tailles.md,
        fontWeight: polices.graisses.semi,
        color: couleurs.neutre[700],
        fontFamily: polices.famille,
      }}>
        {titre}
      </p>
      {description && (
        <p style={{
          margin: '0 0 20px',
          fontSize: polices.tailles.sm,
          color: couleurs.neutre[600],
          fontFamily: polices.famille,
          maxWidth: '320px',
        }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
