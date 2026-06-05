import { useState, useCallback } from 'react';

let compteur = 0;

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const ajouterToast = useCallback((type, texte) => {
    const id = ++compteur;
    setToasts(prev => [...prev, { id, type, texte }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const supprimerToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, ajouterToast, supprimerToast };
}
