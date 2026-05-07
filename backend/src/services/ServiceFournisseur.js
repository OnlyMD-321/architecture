/**
 * ============================================================
 * COUCHE SERVICE — Service des Fournisseurs
 * ============================================================
 * Logique métier pour la gestion des fournisseurs.
 * Inclut la gestion de la liste noire et la validation
 * lors de la soumission d'offres.
 * ============================================================
 */

const DepotFournisseur = require('../repositories/DepotFournisseur');

class ServiceFournisseur {
  constructor() {
    this.depotFournisseur = new DepotFournisseur();
  }

  /**
   * Récupère tous les fournisseurs.
   * @returns {Promise<Array>}
   */
  async listerFournisseurs() {
    return this.depotFournisseur.trouverTous({
      order: [['nom', 'ASC']],
    });
  }

  /**
   * Crée un nouveau fournisseur.
   * @param {object} donnees - Données du fournisseur
   * @returns {Promise<object>}
   */
  async ajouterFournisseur(donnees) {
    return this.depotFournisseur.creer(donnees);
  }

  /**
   * Vérifie qu'un fournisseur peut soumettre une offre.
   * RÈGLE MÉTIER : Un fournisseur en liste noire ne peut pas
   * participer aux appels d'offres ni être affecté à une ressource.
   *
   * @param {number} fournisseurId - Identifiant du fournisseur
   * @returns {Promise<boolean>} true si l'offre est autorisée
   * @throws {Error} Si le fournisseur est en liste noire
   */
  async validerOffreFournisseur(fournisseurId) {
    const fournisseur = await this.depotFournisseur.trouverParId(fournisseurId);

    if (!fournisseur) {
      throw new Error(`Fournisseur avec l'identifiant ${fournisseurId} introuvable.`);
    }

    /** Vérification stricte du statut liste noire */
    if (fournisseur.statut === 'liste_noire') {
      throw new Error(
        `Offre rejetée : le fournisseur "${fournisseur.nom}" est sur la liste noire.`
      );
    }

    return true;
  }

  /**
   * Place un fournisseur sur la liste noire avec un motif justificatif.
   * RÈGLE MÉTIER : un motif est obligatoire — il sera utilisé pour
   * justifier le rejet automatique de toute offre future.
   *
   * @param {number} id - Identifiant du fournisseur
   * @param {string} motif - Motif détaillé du blacklistage
   * @returns {Promise<object>}
   * @throws {Error} Si le motif est absent ou vide
   */
  async mettreEnListeNoire(id, motif) {
    if (!motif || !motif.trim()) {
      throw new Error(
        'Un motif est obligatoire pour placer un fournisseur sur la liste noire.'
      );
    }
    return this.depotFournisseur.mettreEnListeNoire(id, motif.trim());
  }
}

module.exports = ServiceFournisseur;
