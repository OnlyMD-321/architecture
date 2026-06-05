import React from 'react';
import { couleurs, polices, rayons } from '../../theme/tokens';

export default function Select({ value, onChange, options = [], placeholder, disabled, erreur, style = {}, ...rest }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...rest}
      style={{
        width: '100%',
        padding: '8px 12px',
        fontSize: polices.tailles.base,
        fontFamily: polices.famille,
        color: couleurs.neutre[900],
        backgroundColor: disabled ? couleurs.neutre[100] : couleurs.blanc,
        border: `1px solid ${erreur ? couleurs.danger[600] : couleurs.neutre[200]}`,
        borderRadius: rayons.md,
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        appearance: 'auto',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.valeur} value={opt.valeur}>{opt.libelle}</option>
      ))}
    </select>
  );
}
