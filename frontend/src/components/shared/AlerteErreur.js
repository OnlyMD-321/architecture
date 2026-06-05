import React from 'react';
import { couleurs, polices, rayons } from '../../theme/tokens';
import { MdErrorOutline, MdClose } from 'react-icons/md';

export default function AlerteErreur({ message, onFermer }) {
  if (!message) return null;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '12px 16px',
      backgroundColor: couleurs.danger[100],
      border: `1px solid ${couleurs.danger[600]}30`,
      borderRadius: rayons.md,
      marginBottom: '16px',
    }}>
      <MdErrorOutline style={{ color: couleurs.danger[600], fontSize: '18px', flexShrink: 0, marginTop: '1px' }} />
      <p style={{
        margin: 0, flex: 1,
        fontSize: polices.tailles.sm,
        color: couleurs.danger[600],
        fontFamily: polices.famille,
        lineHeight: 1.5,
      }}>
        {message}
      </p>
      {onFermer && (
        <button
          onClick={onFermer}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: couleurs.danger[600], padding: 0, display: 'flex' }}
        >
          <MdClose size={16} />
        </button>
      )}
    </div>
  );
}
