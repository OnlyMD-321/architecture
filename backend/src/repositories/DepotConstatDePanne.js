/**
 * ============================================================
 * PATRON REPOSITORY — Dépôt des Constats de Panne
 * ============================================================
 * Abstrait l'accès aux données de la table 'constats_de_panne'.
 * Fournit des requêtes spécialisées pour le suivi de maintenance.
 * ============================================================
 */

const DepotDeBase = require('./DepotDeBase');
const { ConstatDePanne, Ressource } = require('../models');

class DepotConstatDePanne extends DepotDeBase {
  constructor() {
    super(ConstatDePanne);
  }

  /**
   * Récupère tous les constats avec les informations de la ressource.
   * @returns {Promise<Array>}
   */
  async trouverTousAvecRessource() {
    return this.modele.findAll({
      include: [{ model: Ressource, as: 'ressource' }],
      order: [['date_creation', 'DESC']],
    });
  }

  /**
   * Récupère les constats pour une ressource spécifique.
   * @param {number} ressourceId - Identifiant de la ressource
   * @returns {Promise<Array>}
   */
  async trouverParRessource(ressourceId) {
    return this.modele.findAll({
      where: { ressource_id: ressourceId },
      order: [['date_constat', 'DESC']],
    });
  }

  /**
   * Crée un constat de panne complet.
   * @param {object} donneesConstat - Données du constat
   * @returns {Promise<object>}
   */
  async creerConstat(donneesConstat) {
    return this.modele.create(donneesConstat);
  }
}

module.exports = DepotConstatDePanne;
