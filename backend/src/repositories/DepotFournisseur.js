/**
 * ============================================================
 * PATRON REPOSITORY — Dépôt des Fournisseurs
 * ============================================================
 * Abstrait l'accès aux données de la table 'fournisseurs'.
 * Fournit des méthodes spécifiques pour la gestion des
 * fournisseurs et de la logique de liste noire.
 * ============================================================
 */

const DepotDeBase = require('./DepotDeBase');
const { Fournisseur } = require('../models');

class DepotFournisseur extends DepotDeBase {
  constructor() {
    super(Fournisseur);
  }

  /**
   * Récupère tous les fournisseurs ayant le statut 'actif'.
   * @returns {Promise<Array>}
   */
  async trouverActifs() {
    return this.modele.findAll({
      where: { statut: 'actif' },
      order: [['nom', 'ASC']],
    });
  }

  /**
   * Récupère tous les fournisseurs sur liste noire.
   * @returns {Promise<Array>}
   */
  async trouverListeNoire() {
    return this.modele.findAll({
      where: { statut: 'liste_noire' },
    });
  }

  /**
   * Vérifie si un fournisseur est sur la liste noire.
   * @param {number} fournisseurId - Identifiant du fournisseur
   * @returns {Promise<boolean>} true si le fournisseur est en liste noire
   */
  async estEnListeNoire(fournisseurId) {
    const fournisseur = await this.modele.findByPk(fournisseurId);
    if (!fournisseur) return false;
    return fournisseur.statut === 'liste_noire';
  }

  /**
   * Place un fournisseur sur la liste noire avec son motif justificatif.
   * @param {number} fournisseurId - Identifiant du fournisseur
   * @param {string} motif - Motif justifiant la mise sur liste noire
   * @returns {Promise<object|null>}
   */
  async mettreEnListeNoire(fournisseurId, motif) {
    return this.mettreAJour(fournisseurId, {
      statut: 'liste_noire',
      motif_liste_noire: motif,
    });
  }
}

module.exports = DepotFournisseur;
