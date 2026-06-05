import React from 'react';
import { couleurs, polices } from '../../theme/tokens';

export default function Champ({ libelle, htmlFor, requis, erreur, aide, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label
        htmlFor={htmlFor}
        style={{
          fontSize: polices.tailles.sm,
          fontWeight: polices.graisses.semi,
          color: couleurs.neutre[700],
          fontFamily: polices.famille,
        }}
      >
        {libelle}
        {requis && <span style={{ color: couleurs.danger[600], marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {erreur && (
        <p style={{ margin: 0, fontSize: polices.tailles.xs, color: couleurs.danger[600], fontFamily: polices.famille }}>
          {erreur}
        </p>
      )}
      {aide && !erreur && (
        <p style={{ margin: 0, fontSize: polices.tailles.xs, color: couleurs.neutre[400], fontFamily: polices.famille }}>
          {aide}
        </p>
      )}
    </div>
  );
}

export const stylesInput = (erreur = false) => ({
  width: '100%',
  padding: '8px 12px',
  fontSize: '14px',
  fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
  color: couleurs.neutre[900],
  backgroundColor: couleurs.blanc,
  border: `1px solid ${erreur ? couleurs.danger[600] : couleurs.neutre[200]}`,
  borderRadius: '6px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
});
