import { useState, useCallback, useEffect, useRef } from 'react';

export default function useApi(fonctionApi, { immediat = false, params = [] } = {}) {
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(immediat);
  const [erreur, setErreur] = useState(null);
  const paramsRef = useRef(params);

  const executer = useCallback(async (...args) => {
    setChargement(true);
    setErreur(null);
    try {
      const resultat = await fonctionApi(...args);
      setDonnees(resultat);
      return resultat;
    } catch (e) {
      setErreur(e);
      throw e;
    } finally {
      setChargement(false);
    }
  }, [fonctionApi]);

  useEffect(() => {
    if (immediat) {
      executer(...paramsRef.current);
    }
  }, [immediat, executer]);

  return { donnees, chargement, erreur, executer };
}
