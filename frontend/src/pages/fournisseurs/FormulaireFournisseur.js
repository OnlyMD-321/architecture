import React, { useState, useEffect } from 'react';
import Modal from '../../components/shared/Modal';
import Bouton from '../../components/shared/Bouton';
import Champ, { stylesInput } from '../../components/shared/Champ';
import AlerteErreur from '../../components/shared/AlerteErreur';
import { creerFournisseur } from '../../services/apiService';

const VIDE = { nom: '', ville: '', adresse: '', site_web: '', nom_responsable: '', telephone: '' };

export default function FormulaireFournisseur({ ouvert, onFermer, onSucces }) {
  const [form, setForm] = useState(VIDE);
  const [erreurs, setErreurs] = useState({});
  const [erreurApi, setErreurApi] = useState('');
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    if (ouvert) { setForm(VIDE); setErreurs({}); setErreurApi(''); }
  }, [ouvert]);

  const changer = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (erreurs[name]) setErreurs(prev => ({ ...prev, [name]: '' }));
  };

  const valider = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Le nom du fournisseur est obligatoire.';
    if (form.site_web && !/^https?:\/\//.test(form.site_web)) e.site_web = 'L\'URL doit commencer par http:// ou https://';
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const soumettre = async (ev) => {
    ev.preventDefault();
    if (!valider()) return;
    setEnCours(true);
    setErreurApi('');
    try {
      const donnees = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''));
      await creerFournisseur(donnees);
      onSucces('Fournisseur ajouté avec succès.');
      onFermer();
    } catch (err) {
      setErreurApi(err.message);
    } finally {
      setEnCours(false);
    }
  };

  const inputStyle = (champ) => stylesInput(!!erreurs[champ]);

  return (
    <Modal
      ouvert={ouvert} onFermer={onFermer}
      titre="Nouveau fournisseur" largeur="560px"
      pied={
        <>
          <Bouton variante="fantomeNeutre" onClick={onFermer}>Annuler</Bouton>
          <Bouton variante="primaire" chargement={enCours} onClick={soumettre}>Ajouter le fournisseur</Bouton>
        </>
      }
    >
      <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <AlerteErreur message={erreurApi} onFermer={() => setErreurApi('')} />
        <Champ libelle="Raison sociale" htmlFor="nom" requis erreur={erreurs.nom}>
          <input id="nom" name="nom" value={form.nom} onChange={changer} style={inputStyle('nom')} />
        </Champ>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Champ libelle="Ville" htmlFor="ville">
            <input id="ville" name="ville" value={form.ville} onChange={changer} style={inputStyle('ville')} />
          </Champ>
          <Champ libelle="Téléphone" htmlFor="telephone">
            <input id="telephone" name="telephone" value={form.telephone} onChange={changer} style={inputStyle('telephone')} />
          </Champ>
        </div>
        <Champ libelle="Adresse postale" htmlFor="adresse">
          <textarea id="adresse" name="adresse" value={form.adresse} onChange={changer} rows={2}
            style={{ ...inputStyle('adresse'), resize: 'vertical' }} />
        </Champ>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Champ libelle="Site web" htmlFor="site_web" erreur={erreurs.site_web} aide="ex: https://fournisseur.ma">
            <input id="site_web" name="site_web" value={form.site_web} onChange={changer} style={inputStyle('site_web')} />
          </Champ>
          <Champ libelle="Nom du responsable" htmlFor="nom_responsable">
            <input id="nom_responsable" name="nom_responsable" value={form.nom_responsable} onChange={changer} style={inputStyle('nom_responsable')} />
          </Champ>
        </div>
      </form>
    </Modal>
  );
}
