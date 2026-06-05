import React from 'react';
import { useLocation } from 'react-router-dom';
import { couleurs, polices, disposition, ombres } from '../../theme/tokens';
import { MdCalendarToday } from 'react-icons/md';

const TITRES_PAGES = {
  '/tableau-de-bord': 'Tableau de bord',
  '/ressources':      'Inventaire des ressources',
  '/fournisseurs':    'Gestion des fournisseurs',
  '/constats':        'Constats de panne',
};

export default function BarreSuperieure() {
  const { pathname } = useLocation();
  const titre = TITRES_PAGES[pathname] || 'Application';
  const date = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const dateCapitalisee = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: disposition.largeurSidebar,
      right: 0,
      height: disposition.hauteurTopbar,
      backgroundColor: couleurs.blanc,
      boxShadow: ombres.sm,
      borderBottom: `1px solid ${couleurs.neutre[200]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 100,
    }}>
      <h1 style={{
        margin: 0,
        fontSize: polices.tailles.lg,
        fontWeight: polices.graisses.semi,
        color: couleurs.neutre[900],
        fontFamily: polices.famille,
      }}>
        {titre}
      </h1>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: polices.tailles.sm,
        color: couleurs.neutre[600],
        fontFamily: polices.famille,
      }}>
        <MdCalendarToday size={14} />
        {dateCapitalisee}
      </div>
    </header>
  );
}
