import React from 'react';
import { couleurs } from '../../theme/tokens';

export default function SqueletteChargement({ lignes = 5, colonnes = 4 }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
      `}</style>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {Array.from({ length: lignes }).map((_, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${couleurs.neutre[100]}` }}>
                {Array.from({ length: colonnes }).map((_, j) => (
                  <td key={j} style={{ padding: '14px 16px' }}>
                    <div style={{
                      height: '14px',
                      borderRadius: '4px',
                      width: j === 0 ? '60%' : j === colonnes - 1 ? '40%' : '80%',
                      background: `linear-gradient(to right, ${couleurs.neutre[100]} 8%, ${couleurs.neutre[200]} 18%, ${couleurs.neutre[100]} 33%)`,
                      backgroundSize: '800px 104px',
                      animation: 'shimmer 1.2s infinite linear',
                    }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
