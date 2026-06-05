import React, { useState, useEffect } from 'react';
import Modal from '../../components/shared/Modal';
import Bouton from '../../components/shared/Bouton';
import Champ, { stylesInput } from '../../components/shared/Champ';
import Select from '../../components/shared/Select';
import AlerteErreur from '../../components/shared/AlerteErreur';
import { couleurs, polices, rayons } from '../../theme/tokens';
import { enregistrerConstat, recupererRessources } from '../../services/apiService';

const FREQUENCES = [
  { valeur: 'premiere_fois', libelle: 'Première fois' },
  { valeur: 'occasionnelle', libelle: 'Occasionnelle' },
  { valeur: 'frequente',     libelle: 'Fréquente' },
  { valeur: 'permanente',    libelle: 'Permanente' },
];

const URGENCES = [
  { valeur: 'basse',    libelle: 'Basse' },
  { valeur: 'moyenne',  libelle: 'Moyenne' },
  { valeur: 'haute',    libelle: 'Haute' },
  { valeur: 'critique', libelle: 'Critique' },
];

const NATURES = [
  { valeur: 'materielle', libelle: 'Matérielle' },
  { valeur: 'logicielle', libelle: 'Logicielle' },
];

const VIDE = {
  ressource_id: '', date_constat: new Date().toISOString().slice(0, 10),
  nature_panne: 'materielle', description: '',
  frequence: 'premiere_fois', urgence: 'moyenne',
};

export default function FormulaireConstat({ ouvert, onFermer, onSucces }) {
  const [form, setForm] = useState(VIDE);
  const [erreurs, setErreurs] = useState({});
  const [erreurApi, setErreurApi] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [ressources, setRessources] = useState([]);

  useEffect(() => {
    if (ouvert) {
      setForm({ ...VIDE, date_constat: new Date().toISOString().slice(0, 10) });
      setErreurs({});
      setErreurApi('');
      recupererRessources().then(r => setRessources(r.donnees || [])).catch(() => {});
    }
  }, [ouvert]);

  const changer = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'ressource_id') {
        const res = ressources.find(r => String(r.id) === value);
        if (res?.type === 'imprimante') next.nature_panne = 'materielle';
      }
      return next;
    });
    if (erreurs[name]) setErreurs(prev => ({ ...prev, [name]: '' }));
  };

  const ressourceSelectionnee = ressources.find(r => String(r.id) === String(form.ressource_id));
  const estImprimante = ressourceSelectionnee?.type === 'imprimante';

  const valider = () => {
    const e = {};
    if (!form.ressource_id) e.ressource_id = 'Veuillez sélectionner une ressource.';
    if (!form.description.trim()) e.description = 'La description est obligatoire.';
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const soumettre = async (ev) => {
    ev.preventDefault();
    if (!valider()) return;
    setEnCours(true);
    setErreurApi('');
    try {
      await enregistrerConstat({
        ressource_id: Number(form.ressource_id),
        date_constat: form.date_constat,
        nature_panne: form.nature_panne,
        description: form.description,
        frequence: form.frequence,
        urgence: form.urgence,
      });
      onSucces('Constat de panne enregistré avec succès.');
      onFermer();
    } catch (err) {
      setErreurApi(err.message);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <Modal
      ouvert={ouvert} onFermer={onFermer}
      titre="Nouveau constat de panne" largeur="560px"
      pied={
        <>
          <Bouton variante="fantomeNeutre" onClick={onFermer}>Annuler</Bouton>
          <Bouton variante="primaire" chargement={enCours} onClick={soumettre}>Enregistrer le constat</Bouton>
        </>
      }
    >
      <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <AlerteErreur message={erreurApi} onFermer={() => setErreurApi('')} />

        <Champ libelle="Ressource concernée" htmlFor="ressource_id" requis erreur={erreurs.ressource_id}>
          <Select
            id="ressource_id" name="ressource_id" value={form.ressource_id} onChange={changer}
            placeholder="— Sélectionner une ressource —"
            options={ressources.map(r => ({ valeur: String(r.id), libelle: `${r.nom} (${r.type})` }))}
            erreur={!!erreurs.ressource_id}
          />
        </Champ>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Champ libelle="Date du constat" htmlFor="date_constat">
            <input id="date_constat" name="date_constat" type="date"
              value={form.date_constat} onChange={changer} style={stylesInput()} />
          </Champ>

          <Champ libelle="Nature de la panne" htmlFor="nature_panne">
            {estImprimante ? (
              <>
                <Select
                  id="nature_panne" name="nature_panne"
                  value="materielle" disabled options={NATURES}
                />
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: couleurs.alerte[600], fontFamily: polices.famille }}>
                  Les pannes d'imprimante sont obligatoirement matérielles.
                </p>
              </>
            ) : (
              <Select id="nature_panne" name="nature_panne" value={form.nature_panne} onChange={changer} options={NATURES} />
            )}
          </Champ>
        </div>

        <Champ libelle="Description de la panne" htmlFor="description" requis erreur={erreurs.description}>
          <textarea
            id="description" name="description" rows={3}
            value={form.description} onChange={changer}
            placeholder="Décrivez précisément les symptômes observés..."
            style={{ ...stylesInput(!!erreurs.description), resize: 'vertical' }}
          />
        </Champ>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Champ libelle="Fréquence" htmlFor="frequence">
            <Select id="frequence" name="frequence" value={form.frequence} onChange={changer} options={FREQUENCES} />
          </Champ>
          <Champ libelle="Niveau d'urgence" htmlFor="urgence">
            <Select id="urgence" name="urgence" value={form.urgence} onChange={changer} options={URGENCES} />
          </Champ>
        </div>
      </form>
    </Modal>
  );
}
