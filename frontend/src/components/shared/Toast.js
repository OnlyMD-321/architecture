import React from 'react';
import ReactDOM from 'react-dom';
import { couleurs, polices, rayons, ombres } from '../../theme/tokens';
import { MdCheckCircle, MdError, MdClose } from 'react-icons/md';

function ToastItem({ toast, onSupprimer }) {
  const estSucces = toast.type === 'succes';
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      backgroundColor: couleurs.blanc,
      borderRadius: rayons.lg,
      boxShadow: ombres.lg,
      border: `1px solid ${estSucces ? couleurs.succes[100] : couleurs.danger[100]}`,
      borderLeft: `4px solid ${estSucces ? couleurs.succes[600] : couleurs.danger[600]}`,
      minWidth: '280px',
      maxWidth: '400px',
      animation: 'glisserDedans 0.3s ease',
    }}>
      {estSucces
        ? <MdCheckCircle style={{ color: couleurs.succes[600], fontSize: '20px', flexShrink: 0 }} />
        : <MdError style={{ color: couleurs.danger[600], fontSize: '20px', flexShrink: 0 }} />
      }
      <p style={{
        margin: 0, flex: 1,
        fontSize: polices.tailles.sm,
        color: couleurs.neutre[700],
        fontFamily: polices.famille,
        lineHeight: 1.4,
      }}>
        {toast.texte}
      </p>
      <button
        onClick={() => onSupprimer(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: couleurs.neutre[400], padding: 0, display: 'flex' }}
      >
        <MdClose size={16} />
      </button>
    </div>
  );
}

export default function Toast({ messages = [], onSupprimer }) {
  if (!messages.length) return null;
  return ReactDOM.createPortal(
    <>
      <style>{`@keyframes glisserDedans { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 2000,
      }}>
        {messages.map(t => (
          <ToastItem key={t.id} toast={t} onSupprimer={onSupprimer} />
        ))}
      </div>
    </>,
    document.body
  );
}
