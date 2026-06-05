import React, { useState, useEffect } from 'react';
import Modal from '../../components/shared/Modal';
import Bouton from '../../components/shared/Bouton';
import Champ, { stylesInput } from '../../components/shared/Champ';
import AlerteErreur from '../../components/shared/AlerteErreur';
import { couleurs, polices, rayons } from '../../theme/tokens';
import { mettreEnListeNoire } from '../../services/apiService';
import { MdBlock } from 'react-icons/md';

export default function ModalListeNoire({ ouvert, onFermer, onSucces, fournisseur }) {
  const [motif, setMotif] = useState('');
  const [erreurMotif, setErreurMotif] = useState('');
  const [erreurApi, setErreurApi] = useState('');
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    if (ouvert) { setMotif(''); setErreurMotif(''); setErreurApi(''); }
  }, [ouvert]);

  const confirmer = async () => {
    if (!motif.trim()) { setErreurMotif('Le motif est obligatoire.'); return; }
    setEnCours(true);
    setErreurApi('');
    try {
      await mettreEnListeNoire(fournisseur.id, motif.trim());
      onSucces(`${fournisseur.nom} a été mis en liste noire.`);
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
      titre="Mettre en liste noire" largeur="480px"
      pied={
        <>
          <Bouton variante="fantomeNeutre" onClick={onFermer}>Annuler</Bouton>
          <Bouton variante="fantome" chargement={enCours} icone={<MdBlock size={15} />} onClick={confirmer}>
            Mettre en liste noire
          </Bouton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AlerteErreur message={erreurApi} onFermer={() => setErreurApi('')} />

        <div style={{
          padding: '12px 14px',
          backgroundColor: couleurs.alerte[100],
          border: `1px solid ${couleurs.alerte[600]}40`,
          borderRadius: rayons.md,
          fontSize: polices.tailles.sm,
          color: couleurs.alerte[600],
          fontFamily: polices.famille,
          lineHeight: 1.5,
        }}>
          ⚠️ Vous êtes sur le point de mettre <strong>{fournisseur?.nom}</strong> sur liste noire.
          Cette action bloquera toute future création de ressources pour ce fournisseur.
        </div>

        <Champ libelle="Motif justificatif" htmlFor="motif" requis erreur={erreurMotif}
          aide="Documentez la raison pour assurer la traçabilité de la décision.">
          <textarea
            id="motif" rows={4}
            value={motif}
            onChange={e => { setMotif(e.target.value); if (erreurMotif) setErreurMotif(''); }}
            placeholder="Ex: Retards de livraison récurrents, non-respect des engagements contractuels..."
            style={{ ...stylesInput(!!erreurMotif), resize: 'vertical' }}
          />
        </Champ>
      </div>
    </Modal>
  );
}
