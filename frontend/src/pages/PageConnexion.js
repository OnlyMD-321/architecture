import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { seConnecter } from '../services/apiService';
import { couleurs, polices, ombres, rayons } from '../theme/tokens';

const ROLES_COULEURS = {
  admin:       { fond: couleurs.violet[100], texte: couleurs.violet[600] },
  responsable: { fond: couleurs.info[100],   texte: couleurs.info[600] },
  technicien:  { fond: couleurs.alerte[100], texte: couleurs.alerte[600] },
  lecteur:     { fond: couleurs.neutre[100], texte: couleurs.neutre[600] },
};

const COMPTES_DEMO = [
  { role: 'admin',       email: 'admin@grm.ma',       label: 'Administrateur' },
  { role: 'responsable', email: 'responsable@grm.ma', label: 'Responsable' },
  { role: 'technicien',  email: 'technicien@grm.ma',  label: 'Technicien' },
  { role: 'lecteur',     email: 'lecteur@grm.ma',     label: 'Lecteur' },
];

export default function PageConnexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const { connecter } = useAuth();
  const navigate = useNavigate();

  const soumettre = async (e) => {
    e.preventDefault();
    if (!email || !motDePasse) { setErreur('Veuillez remplir tous les champs.'); return; }
    setChargement(true);
    setErreur('');
    try {
      const res = await seConnecter(email, motDePasse);
      connecter(res.token, res.utilisateur);
      navigate('/tableau-de-bord', { replace: true });
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  const remplirDemo = (emailDemo) => {
    setEmail(emailDemo);
    setMotDePasse('password123');
    setErreur('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: couleurs.primaire[900],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: polices.famille,
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px',
            backgroundColor: couleurs.primaire[600],
            borderRadius: rayons.xl,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '20px', fontWeight: 700, color: couleurs.blanc,
          }}>
            GRM
          </div>
          <h1 style={{ margin: 0, fontSize: polices.tailles['2xl'], fontWeight: polices.graisses.gras, color: couleurs.blanc }}>
            Gestion des Ressources
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: polices.tailles.sm, color: 'rgba(255,255,255,0.55)' }}>
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Carte formulaire */}
        <div style={{
          backgroundColor: couleurs.blanc,
          borderRadius: rayons.xl,
          boxShadow: ombres.xl,
          padding: '32px',
        }}>
          {erreur && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: couleurs.danger[100],
              border: `1px solid ${couleurs.danger[600]}30`,
              borderRadius: rayons.md,
              marginBottom: '20px',
              fontSize: polices.tailles.sm,
              color: couleurs.danger[600],
            }}>
              {erreur}
            </div>
          )}

          <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: polices.tailles.sm, fontWeight: polices.graisses.semi, color: couleurs.neutre[700] }}>
                Adresse email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.ma"
                style={stylesInput}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: polices.tailles.sm, fontWeight: polices.graisses.semi, color: couleurs.neutre[700] }}>
                Mot de passe
              </label>
              <input
                type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                style={stylesInput}
              />
            </div>

            <button
              type="submit" disabled={chargement}
              style={{
                padding: '10px',
                backgroundColor: chargement ? couleurs.primaire[600] + '80' : couleurs.primaire[600],
                color: couleurs.blanc,
                border: 'none',
                borderRadius: rayons.md,
                fontSize: polices.tailles.md,
                fontWeight: polices.graisses.semi,
                cursor: chargement ? 'not-allowed' : 'pointer',
                fontFamily: polices.famille,
                marginTop: '4px',
              }}
            >
              {chargement ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Comptes démo */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${couleurs.neutre[100]}` }}>
            <p style={{ margin: '0 0 10px', fontSize: polices.tailles.xs, color: couleurs.neutre[400], textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Comptes de démonstration
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {COMPTES_DEMO.map(c => {
                const s = ROLES_COULEURS[c.role];
                return (
                  <button key={c.role} onClick={() => remplirDemo(c.email)}
                    style={{
                      padding: '7px 10px',
                      backgroundColor: s.fond,
                      color: s.texte,
                      border: 'none',
                      borderRadius: rayons.md,
                      fontSize: polices.tailles.xs,
                      fontWeight: polices.graisses.semi,
                      cursor: 'pointer',
                      fontFamily: polices.famille,
                      textAlign: 'left',
                    }}
                  >
                    {c.label}
                    <span style={{ display: 'block', fontSize: '10px', opacity: 0.7, marginTop: '1px' }}>{c.email}</span>
                  </button>
                );
              })}
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '11px', color: couleurs.neutre[400], textAlign: 'center' }}>
              Mot de passe : <strong>password123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const stylesInput = {
  padding: '9px 12px',
  fontSize: '14px',
  fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
  color: '#0f172a',
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
};
