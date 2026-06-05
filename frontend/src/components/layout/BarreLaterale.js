import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdComputer, MdBusinessCenter, MdWarning, MdLogout } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';
import { couleurs, polices, rayons, disposition } from '../../theme/tokens';

const NAVIGATION = [
  { chemin: '/tableau-de-bord', libelle: 'Tableau de bord', icone: MdDashboard },
  { chemin: '/ressources',      libelle: 'Ressources',       icone: MdComputer },
  { chemin: '/fournisseurs',    libelle: 'Fournisseurs',     icone: MdBusinessCenter },
  { chemin: '/constats',        libelle: 'Constats de panne', icone: MdWarning },
];

function LienNav({ chemin, libelle, Icone }) {
  const [survol, setSurvol] = useState(false);
  return (
    <NavLink
      to={chemin}
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => setSurvol(false)}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: polices.tailles.base,
        fontWeight: isActive ? polices.graisses.semi : polices.graisses.normal,
        fontFamily: polices.famille,
        color: isActive ? couleurs.blanc : survol ? couleurs.blanc : 'rgba(255,255,255,0.72)',
        backgroundColor: isActive ? couleurs.primaire[700] : survol ? 'rgba(255,255,255,0.08)' : 'transparent',
        borderLeft: isActive ? `3px solid ${couleurs.blanc}` : '3px solid transparent',
        transition: 'all 0.15s',
        marginBottom: '2px',
      })}
    >
      <Icone size={18} style={{ flexShrink: 0 }} />
      {libelle}
    </NavLink>
  );
}

const ROLES_LABELS = {
  admin: { libelle: 'Administrateur', fond: couleurs.violet[100], texte: couleurs.violet[600] },
  responsable: { libelle: 'Responsable', fond: couleurs.info[100], texte: couleurs.info[600] },
  technicien: { libelle: 'Technicien', fond: couleurs.alerte[100], texte: couleurs.alerte[600] },
  lecteur: { libelle: 'Lecteur', fond: couleurs.neutre[100], texte: couleurs.neutre[600] },
};

export default function BarreLaterale() {
  const { utilisateur, deconnecter } = useAuth();
  const roleInfo = utilisateur ? (ROLES_LABELS[utilisateur.role] || ROLES_LABELS.lecteur) : null;

  return (
    <aside style={{
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      width: disposition.largeurSidebar,
      backgroundColor: couleurs.primaire[900],
      display: 'flex',
      flexDirection: 'column',
      zIndex: 200,
      overflowY: 'auto',
    }}>
      {/* Logo / Brand */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        marginBottom: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            backgroundColor: couleurs.primaire[600],
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 700, color: couleurs.blanc,
            fontFamily: polices.famille, flexShrink: 0,
          }}>
            GRM
          </div>
          <div>
            <p style={{ margin: 0, fontSize: polices.tailles.sm, fontWeight: polices.graisses.semi, color: couleurs.blanc, fontFamily: polices.famille }}>
              Ressources
            </p>
            <p style={{ margin: 0, fontSize: polices.tailles.xs, color: 'rgba(255,255,255,0.55)', fontFamily: polices.famille }}>
              Gestion Matérielles
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        {NAVIGATION.map(({ chemin, libelle, icone: Icone }) => (
          <LienNav key={chemin} chemin={chemin} libelle={libelle} Icone={Icone} />
        ))}
      </nav>

      {/* Utilisateur connecté */}
      {utilisateur && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.10)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: couleurs.primaire[600],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: couleurs.blanc, fontFamily: polices.famille,
            }}>
              {utilisateur.nom?.charAt(0).toUpperCase() || '?'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: polices.tailles.sm, fontWeight: polices.graisses.semi, color: couleurs.blanc, fontFamily: polices.famille, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {utilisateur.nom}
              </p>
              {roleInfo && (
                <span style={{
                  display: 'inline-block', marginTop: '2px',
                  padding: '1px 6px', borderRadius: rayons.complet,
                  fontSize: '10px', fontWeight: polices.graisses.semi,
                  backgroundColor: roleInfo.fond, color: roleInfo.texte,
                  fontFamily: polices.famille,
                }}>
                  {roleInfo.libelle}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={deconnecter}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
              padding: '7px 10px', borderRadius: rayons.md,
              backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.65)', cursor: 'pointer',
              fontSize: polices.tailles.xs, fontFamily: polices.famille,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = couleurs.blanc; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
          >
            <MdLogout size={14} />
            Se déconnecter
          </button>
        </div>
      )}
    </aside>
  );
}
