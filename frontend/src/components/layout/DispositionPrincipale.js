import React from 'react';
import { Outlet } from 'react-router-dom';
import BarreLaterale from './BarreLaterale';
import BarreSuperieure from './BarreSuperieure';
import { couleurs, disposition } from '../../theme/tokens';

export default function DispositionPrincipale() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: couleurs.neutre[50] }}>
      <BarreLaterale />
      <div style={{
        marginLeft: disposition.largeurSidebar,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <BarreSuperieure />
        <main style={{
          marginTop: disposition.hauteurTopbar,
          padding: '24px',
          flex: 1,
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
