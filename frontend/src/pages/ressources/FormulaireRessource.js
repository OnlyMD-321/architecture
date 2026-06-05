import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../components/shared/Modal';
import Bouton from '../../components/shared/Bouton';
import Champ, { stylesInput } from '../../components/shared/Champ';
import Select from '../../components/shared/Select';
import AlerteErreur from '../../components/shared/AlerteErreur';
import { couleurs, polices, rayons } from '../../theme/tokens';
import { creerRessource, mettreAJourRessource, recupererFournisseurs } from '../../services/apiService';

const ETATS = [
  { valeur: 'disponible', libelle: 'Disponible' },
  { valeur: 'en_service', libelle: 'En service' },
  { valeur: 'en_panne',   libelle: 'En panne' },
  { valeur: 'reforme',    libelle: 'Réformé' },
];

const VIDE = {
  nom: '', type: '', marque: '', prix_unitaire_mad: '',
  fournisseur_id: '', etat: 'disponible',
  cpu: '', ram: '', hdd: '', vitesse_impression: '', resolution: '',
};

export default function FormulaireRessource({ ouvert, onFermer, onSucces, ressource }) {
  const modeEdition = Boolean(ressource);
  const [form, setForm] = useState(VIDE);
  const [erreurs, setErreurs] = useState({});
  const [erreurApi, setErreurApi] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);

  useEffect(() => {
    if (ouvert) {
      recupererFournisseurs()
        .then(r => setFournisseurs(r.donnees || []))
        .catch(() => {});
    }
  }, [ouvert]);

  useEffect(() => {
    if (ouvert) {
      if (ressource) {
        setForm({
          nom: ressource.nom || '',
          type: ressource.type || '',
          marque: ressource.marque || '',
          prix_unitaire_mad: ressource.prix_unitaire_mad || '',
          fournisseur_id: ressource.fournisseur_id || '',
          etat: ressource.etat || 'disponible',
          cpu: ressource.specifications?.cpu || '',
          ram: ressource.specifications?.ram || '',
          hdd: ressource.specifications?.hdd || '',
          vitesse_impression: ressource.specifications?.vitesse_impression || '',
          resolution: ressource.specifications?.resolution || '',
        });
      } else {
        setForm(VIDE);
      }
      setErreurs({});
      setErreurApi('');
    }
  }, [ouvert, ressource]);

  const changer = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (erreurs[name]) setErreurs(prev => ({ ...prev, [name]: '' }));
  };

  const valider = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Le nom est obligatoire.';
    if (!form.type) e.type = 'Le type est obligatoire.';
    if (!form.prix_unitaire_mad || Number(form.prix_unitaire_mad) <= 0) e.prix_unitaire_mad = 'Le prix doit être supérieur à 0.';
    if (form.type === 'ordinateur') {
      if (!form.cpu.trim()) e.cpu = 'Le processeur est obligatoire.';
      if (!form.ram.trim()) e.ram = 'La RAM est obligatoire.';
      if (!form.hdd.trim()) e.hdd = 'Le stockage est obligatoire.';
    }
    if (form.type === 'imprimante') {
      if (!form.vitesse_impression.trim()) e.vitesse_impression = 'La vitesse est obligatoire.';
      if (!form.resolution.trim()) e.resolution = 'La résolution est obligatoire.';
    }
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const soumettre = async (e) => {
    e.preventDefault();
    if (!valider()) return;
    setEnCours(true);
    setErreurApi('');
    try {
      const donnees = {
        nom: form.nom,
        type: form.type,
        marque: form.marque,
        prix_unitaire_mad: Number(form.prix_unitaire_mad),
        fournisseur_id: form.fournisseur_id ? Number(form.fournisseur_id) : undefined,
        etat: form.etat,
        ...(form.type === 'ordinateur' && { cpu: form.cpu, ram: form.ram, hdd: form.hdd }),
        ...(form.type === 'imprimante' && { vitesse_impression: form.vitesse_impression, resolution: form.resolution }),
      };
      if (modeEdition) {
        await mettreAJourRessource(ressource.id, donnees);
      } else {
        await creerRessource(donnees);
      }
      onSucces(modeEdition ? 'Ressource modifiée avec succès.' : 'Ressource créée avec succès.');
      onFermer();
    } catch (err) {
      setErreurApi(err.message);
    } finally {
      setEnCours(false);
    }
  };

  const fournisseurSelectionne = fournisseurs.find(f => String(f.id) === String(form.fournisseur_id));
  const fournisseurListeNoire = fournisseurSelectionne?.statut === 'liste_noire';

  return (
    <Modal
      ouvert={ouvert}
      onFermer={onFermer}
      titre={modeEdition ? 'Modifier la ressource' : 'Nouvelle ressource'}
      largeur="640px"
      pied={
        <>
          <Bouton variante="fantomeNeutre" onClick={onFermer}>Annuler</Bouton>
          <Bouton variante="primaire" type="submit" chargement={enCours} onClick={soumettre}>
            {modeEdition ? 'Enregistrer' : 'Créer la ressource'}
          </Bouton>
        </>
      }
    >
      <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AlerteErreur message={erreurApi} onFermer={() => setErreurApi('')} />

        {fournisseurListeNoire && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: couleurs.alerte[100],
            border: `1px solid ${couleurs.alerte[600]}40`,
            borderRadius: rayons.md,
            fontSize: polices.tailles.sm,
            color: couleurs.alerte[600],
            fontFamily: polices.famille,
          }}>
            ⚠️ Ce fournisseur est sur liste noire. La création sera refusée par le serveur.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Champ libelle="Nom de la ressource" htmlFor="nom" requis erreur={erreurs.nom}>
            <input id="nom" name="nom" value={form.nom} onChange={changer} style={stylesInput(!!erreurs.nom)} />
          </Champ>
          <Champ libelle="Type" htmlFor="type" requis erreur={erreurs.type}>
            <Select
              id="type" name="type" value={form.type} onChange={changer}
              placeholder="Choisir un type"
              options={[{ valeur: 'ordinateur', libelle: 'Ordinateur' }, { valeur: 'imprimante', libelle: 'Imprimante' }]}
              erreur={!!erreurs.type}
            />
          </Champ>
          <Champ libelle="Marque" htmlFor="marque">
            <input id="marque" name="marque" value={form.marque} onChange={changer} style={stylesInput()} />
          </Champ>
          <Champ libelle="Prix unitaire (MAD)" htmlFor="prix_unitaire_mad" requis erreur={erreurs.prix_unitaire_mad}>
            <input id="prix_unitaire_mad" name="prix_unitaire_mad" type="number" min="0" step="0.01"
              value={form.prix_unitaire_mad} onChange={changer} style={stylesInput(!!erreurs.prix_unitaire_mad)} />
          </Champ>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: modeEdition ? '1fr 1fr' : '1fr', gap: '16px' }}>
          <Champ libelle="Fournisseur" htmlFor="fournisseur_id">
            <Select
              id="fournisseur_id" name="fournisseur_id" value={form.fournisseur_id} onChange={changer}
              placeholder="— Aucun fournisseur —"
              options={fournisseurs.map(f => ({
                valeur: String(f.id),
                libelle: f.statut === 'liste_noire' ? `${f.nom} ⛔` : f.nom,
              }))}
            />
          </Champ>
          {modeEdition && (
            <Champ libelle="État" htmlFor="etat">
              <Select id="etat" name="etat" value={form.etat} onChange={changer} options={ETATS} />
            </Champ>
          )}
        </div>

        {form.type === 'ordinateur' && (
          <fieldset style={{ border: `1px solid ${couleurs.neutre[200]}`, borderRadius: rayons.md, padding: '16px', margin: 0 }}>
            <legend style={{ fontSize: polices.tailles.sm, fontWeight: polices.graisses.semi, color: couleurs.neutre[600], padding: '0 6px' }}>
              Spécifications — Ordinateur
            </legend>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <Champ libelle="Processeur (CPU)" htmlFor="cpu" requis erreur={erreurs.cpu}>
                <input id="cpu" name="cpu" value={form.cpu} onChange={changer} placeholder="ex: Intel i7-12th" style={stylesInput(!!erreurs.cpu)} />
              </Champ>
              <Champ libelle="Mémoire (RAM)" htmlFor="ram" requis erreur={erreurs.ram}>
                <input id="ram" name="ram" value={form.ram} onChange={changer} placeholder="ex: 16 Go DDR4" style={stylesInput(!!erreurs.ram)} />
              </Champ>
              <Champ libelle="Stockage (HDD/SSD)" htmlFor="hdd" requis erreur={erreurs.hdd}>
                <input id="hdd" name="hdd" value={form.hdd} onChange={changer} placeholder="ex: 512 Go SSD" style={stylesInput(!!erreurs.hdd)} />
              </Champ>
            </div>
          </fieldset>
        )}

        {form.type === 'imprimante' && (
          <fieldset style={{ border: `1px solid ${couleurs.neutre[200]}`, borderRadius: rayons.md, padding: '16px', margin: 0 }}>
            <legend style={{ fontSize: polices.tailles.sm, fontWeight: polices.graisses.semi, color: couleurs.neutre[600], padding: '0 6px' }}>
              Spécifications — Imprimante
            </legend>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Champ libelle="Vitesse d'impression" htmlFor="vitesse_impression" requis erreur={erreurs.vitesse_impression}>
                <input id="vitesse_impression" name="vitesse_impression" value={form.vitesse_impression}
                  onChange={changer} placeholder="ex: 30 ppm" style={stylesInput(!!erreurs.vitesse_impression)} />
              </Champ>
              <Champ libelle="Résolution" htmlFor="resolution" requis erreur={erreurs.resolution}>
                <input id="resolution" name="resolution" value={form.resolution}
                  onChange={changer} placeholder="ex: 1200x1200 dpi" style={stylesInput(!!erreurs.resolution)} />
              </Champ>
            </div>
          </fieldset>
        )}
      </form>
    </Modal>
  );
}
