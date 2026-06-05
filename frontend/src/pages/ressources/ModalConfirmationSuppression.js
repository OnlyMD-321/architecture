import React, { useState } from 'react';
import Modal from '../../components/shared/Modal';
import Bouton from '../../components/shared/Bouton';
import AlerteErreur from '../../components/shared/AlerteErreur';
import { couleurs, polices } from '../../theme/tokens';
import { supprimerRessource } from '../../services/apiService';
import { MdDeleteForever } from 'react-icons/md';

export default function ModalConfirmationSuppression({ ouvert, onFermer, onSucces, ressource }) {
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState('');

  const confirmer = async () => {
    setEnCours(true);
    setErreur('');
    try {
      await supprimerRessource(ressource.id);
      onSucces('Ressource supprimée avec succès.');
      onFermer();
    } catch (err) {
      setErreur(err.message);
      setEnCours(false);
    }
  };

  return (
    <Modal
      ouvert={ouvert}
      onFermer={onFermer}
      titre="Supprimer la ressource"
      largeur="440px"
      pied={
        <>
          <Bouton variante="fantomeNeutre" onClick={onFermer}>Annuler</Bouton>
          <Bouton variante="danger" chargement={enCours} onClick={confirmer}
            icone={<MdDeleteForever size={16} />}>
            Supprimer
          </Bouton>
        </>
      }
    >
      <AlerteErreur message={erreur} onFermer={() => setErreur('')} />
      <p style={{ margin: 0, fontSize: polices.tailles.base, color: couleurs.neutre[700], fontFamily: polices.famille, lineHeight: 1.6 }}>
        Êtes-vous sûr de vouloir supprimer la ressource{' '}
        <strong style={{ color: couleurs.neutre[900] }}>{ressource?.nom}</strong> ?
        Cette action est <strong>irréversible</strong>.
      </p>
    </Modal>
  );
}
