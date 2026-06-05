import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const CLE_TOKEN = 'grm_token';
const CLE_UTILISATEUR = 'grm_utilisateur';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(CLE_TOKEN));
  const [utilisateur, setUtilisateur] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CLE_UTILISATEUR)); } catch { return null; }
  });

  const connecter = useCallback((tokenRecu, utilisateurRecu) => {
    localStorage.setItem(CLE_TOKEN, tokenRecu);
    localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(utilisateurRecu));
    setToken(tokenRecu);
    setUtilisateur(utilisateurRecu);
  }, []);

  const deconnecter = useCallback(() => {
    localStorage.removeItem(CLE_TOKEN);
    localStorage.removeItem(CLE_UTILISATEUR);
    setToken(null);
    setUtilisateur(null);
  }, []);

  const aLeDroit = useCallback((...roles) => {
    return utilisateur ? roles.includes(utilisateur.role) : false;
  }, [utilisateur]);

  return (
    <AuthContext.Provider value={{
      token,
      utilisateur,
      estAuthentifie: Boolean(token),
      connecter,
      deconnecter,
      aLeDroit,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
