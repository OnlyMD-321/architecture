import React, { useState } from 'react';
import { couleurs, polices } from '../../theme/tokens';
import SqueletteChargement from './SqueletteChargement';
import EtatVide from './EtatVide';

export default function Tableau({ colonnes = [], donnees = [], cle = 'id', chargement, etatVide, actions }) {
  const [lignesSurvol, setLignesSurvol] = useState({});

  if (chargement) return <SqueletteChargement colonnes={colonnes.length + (actions ? 1 : 0)} />;
  if (!donnees.length) return etatVide || <EtatVide titre="Aucune donnée" />;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: polices.famille }}>
        <thead>
          <tr style={{ backgroundColor: couleurs.neutre[50], borderBottom: `2px solid ${couleurs.neutre[200]}` }}>
            {colonnes.map(col => (
              <th
                key={col.cle}
                style={{
                  padding: '10px 16px',
                  textAlign: col.alignement === 'droite' ? 'right' : col.alignement === 'centre' ? 'center' : 'left',
                  fontSize: polices.tailles.xs,
                  fontWeight: polices.graisses.semi,
                  color: couleurs.neutre[600],
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  width: col.largeur,
                }}
              >
                {col.libelle}
              </th>
            ))}
            {actions && (
              <th style={{
                padding: '10px 16px',
                textAlign: 'right',
                fontSize: polices.tailles.xs,
                fontWeight: polices.graisses.semi,
                color: couleurs.neutre[600],
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                width: '100px',
              }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {donnees.map((ligne, i) => (
            <tr
              key={ligne[cle] ?? i}
              onMouseEnter={() => setLignesSurvol(prev => ({ ...prev, [i]: true }))}
              onMouseLeave={() => setLignesSurvol(prev => ({ ...prev, [i]: false }))}
              style={{
                backgroundColor: lignesSurvol[i] ? couleurs.neutre[50] : couleurs.blanc,
                borderBottom: `1px solid ${couleurs.neutre[100]}`,
                transition: 'background-color 0.1s',
              }}
            >
              {colonnes.map(col => (
                <td
                  key={col.cle}
                  style={{
                    padding: '12px 16px',
                    fontSize: polices.tailles.base,
                    color: couleurs.neutre[700],
                    textAlign: col.alignement === 'droite' ? 'right' : col.alignement === 'centre' ? 'center' : 'left',
                    verticalAlign: 'middle',
                  }}
                >
                  {col.rendu ? col.rendu(ligne[col.cle], ligne) : (ligne[col.cle] ?? '—')}
                </td>
              ))}
              {actions && (
                <td style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    {actions(ligne)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
