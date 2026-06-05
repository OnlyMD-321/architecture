import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { couleurs, polices, rayons, ombres } from '../../theme/tokens';
import Bouton from './Bouton';
import { MdClose } from 'react-icons/md';

export default function Modal({ ouvert, onFermer, titre, largeur = '560px', children, pied }) {
  const fermerSurEchap = useCallback((e) => {
    if (e.key === 'Escape') onFermer();
  }, [onFermer]);

  useEffect(() => {
    if (ouvert) {
      document.addEventListener('keydown', fermerSurEchap);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', fermerSurEchap);
      document.body.style.overflow = '';
    };
  }, [ouvert, fermerSurEchap]);

  if (!ouvert) return null;

  return ReactDOM.createPortal(
    <div
      onClick={onFermer}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(15,23,42,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: couleurs.blanc,
          borderRadius: rayons.xl,
          boxShadow: ombres.xl,
          width: '100%',
          maxWidth: largeur,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* En-tête */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: `1px solid ${couleurs.neutre[100]}`,
          flexShrink: 0,
        }}>
          <h3 style={{
            margin: 0,
            fontSize: polices.tailles.lg,
            fontWeight: polices.graisses.semi,
            color: couleurs.neutre[900],
            fontFamily: polices.famille,
          }}>
            {titre}
          </h3>
          <button
            onClick={onFermer}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: couleurs.neutre[400], fontSize: '20px',
              display: 'flex', alignItems: 'center', padding: '4px',
              borderRadius: rayons.sm,
            }}
          >
            <MdClose />
          </button>
        </div>

        {/* Corps */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Pied */}
        {pied && (
          <div style={{
            padding: '16px 24px',
            borderTop: `1px solid ${couleurs.neutre[100]}`,
            display: 'flex', justifyContent: 'flex-end', gap: '8px',
            flexShrink: 0,
            backgroundColor: couleurs.neutre[50],
          }}>
            {pied}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
