import React, { useState, useCallback } from 'react';
import Carte from '../../components/shared/Carte';
import Tableau from '../../components/shared/Tableau';
import Badge, { STATUTS_FOURNISSEUR } from '../../components/shared/Badge';
import Bouton from '../../components/shared/Bouton';
import EtatVide from '../../components/shared/EtatVide';
import Toast from '../../components/shared/Toast';
import FormulaireFournisseur from './FormulaireFournisseur';
import ModalListeNoire from './ModalListeNoire';
import useApi from '../../hooks/useApi';
import useToast from '../../hooks/useToast';
import { recupererFournisseurs } from '../../services/apiService';
import { couleurs } from '../../theme/tokens';
import { MdAdd, MdBlock, MdBusinessCenter } from 'react-icons/md';

const COLONNES = [
  { cle: 'nom', libelle: 'Fournisseur', rendu: (v, ligne) => (
    <div>
      <p style={{ margin: 0, fontWeight: 500, color: '#0f172a' }}>{v}</p>
      {ligne.nom_responsable && <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>{ligne.nom_responsable}</p>}
    </div>
  )},
  { cle: 'ville', libelle: 'Ville', rendu: v => v || '—' },
  { cle: 'telephone', libelle: 'Téléphone', rendu: v => v || '—' },
  { cle: 'site_web', libelle: 'Site web', rendu: v => v
    ? <a href={v} target="_blank" rel="noopener noreferrer" style={{ color: couleurs.primaire[600], textDecoration: 'none', fontSize: '13px' }}>{v.replace(/^https?:\/\//, '')}</a>
    : '—'
  },
  { cle: 'statut', libelle: 'Statut', rendu: v => {
    const d = STATUTS_FOURNISSEUR[v];
    return d ? <Badge variante={d.variante} libelle={d.libelle} taille="sm" /> : v;
  }},
  { cle: 'motif_liste_noire', libelle: 'Motif liste noire', rendu: v => v
    ? <span style={{ fontSize: '12px', color: '#dc2626', fontStyle: 'italic' }}>{v.length > 50 ? v.slice(0, 50) + '…' : v}</span>
    : '—'
  },
];

export default function PageFournisseurs() {
  const [modalAjouter, setModalAjouter] = useState(false);
  const [fournisseurListeNoire, setFournisseurListeNoire] = useState(null);
  const { toasts, ajouterToast, supprimerToast } = useToast();

  const charger = useCallback(() => recupererFournisseurs(), []);
  const { donnees, chargement, executer: recharger } = useApi(charger, { immediat: true });

  const fournisseurs = donnees?.donnees || [];

  const onSucces = (msg) => {
    ajouterToast('succes', msg);
    recharger();
  };

  return (
    <>
      <Carte
        titre="Gestion des fournisseurs"
        sousTitre={`${fournisseurs.length} fournisseur${fournisseurs.length !== 1 ? 's' : ''} référencé${fournisseurs.length !== 1 ? 's' : ''}`}
        actions={
          <Bouton variante="primaire" icone={<MdAdd size={16} />} onClick={() => setModalAjouter(true)}>
            Nouveau fournisseur
          </Bouton>
        }
      >
        <Tableau
          colonnes={COLONNES}
          donnees={fournisseurs}
          chargement={chargement}
          etatVide={
            <EtatVide
              icone={<MdBusinessCenter />}
              titre="Aucun fournisseur"
              description="Ajoutez votre premier fournisseur pour commencer."
              action={
                <Bouton variante="primaire" icone={<MdAdd size={16} />} onClick={() => setModalAjouter(true)}>
                  Nouveau fournisseur
                </Bouton>
              }
            />
          }
          actions={(ligne) => (
            ligne.statut !== 'liste_noire' ? (
              <button
                title="Mettre en liste noire"
                onClick={() => setFournisseurListeNoire(ligne)}
                style={{
                  background: 'none',
                  border: `1px solid ${couleurs.danger[600]}30`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: couleurs.danger[600],
                  padding: '5px',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <MdBlock size={15} />
              </button>
            ) : null
          )}
        />
      </Carte>

      <FormulaireFournisseur
        ouvert={modalAjouter}
        onFermer={() => setModalAjouter(false)}
        onSucces={onSucces}
      />

      {fournisseurListeNoire && (
        <ModalListeNoire
          ouvert={Boolean(fournisseurListeNoire)}
          onFermer={() => setFournisseurListeNoire(null)}
          onSucces={onSucces}
          fournisseur={fournisseurListeNoire}
        />
      )}

      <Toast messages={toasts} onSupprimer={supprimerToast} />
    </>
  );
}
