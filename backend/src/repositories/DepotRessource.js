/**
 * ============================================================
 * PATRON REPOSITORY — Dépôt des Ressources
 * ============================================================
 * Abstrait l'accès aux données de la table 'ressources'.
 * Hérite du DepotDeBase et ajoute des requêtes spécifiques
 * au domaine des ressources matérielles.
 * ============================================================
 */

const DepotDeBase = require('./DepotDeBase');
const { Ressource, Fournisseur } = require('../models');

class DepotRessource extends DepotDeBase {
  constructor() {
    super(Ressource);
  }

  /**
   * Récupère toutes les ressources avec les informations du fournisseur.
   * @returns {Promise<Array>}
   */
  async trouverToutesAvecFournisseur() {
    return this.modele.findAll({
      include: [{ model: Fournisseur, as: 'fournisseur' }],
      order: [['date_creation', 'DESC']],
    });
  }

  /**
   * Récupère les ressources filtrées par type (ordinateur/imprimante).
   * @param {string} type - Le type de ressource
   * @returns {Promise<Array>}
   */
  async trouverParType(type) {
    return this.modele.findAll({
      where: { type },
      include: [{ model: Fournisseur, as: 'fournisseur' }],
    });
  }

  /**
   * Récupère les ressources ayant un état spécifique.
   * @param {string} etat - L'état souhaité (disponible, en_service, en_panne, reforme)
   * @returns {Promise<Array>}
   */
  async trouverParEtat(etat) {
    return this.modele.findAll({
      where: { etat },
      include: [{ model: Fournisseur, as: 'fournisseur' }],
    });
  }

  /**
   * Crée une ressource avec ses spécifications techniques.
   * @param {object} donneesRessource - Données complètes de la ressource
   * @returns {Promise<object>}
   */
  async creerAvecSpecifications(donneesRessource) {
    return this.modele.create(donneesRessource);
  }
}

module.exports = DepotRessource;
