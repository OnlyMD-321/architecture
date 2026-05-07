/**
 * ============================================================
 * PATRON REPOSITORY — Dépôt de base (classe abstraite)
 * ============================================================
 * Fournit une couche d'abstraction entre la logique métier et
 * la source de données (PostgreSQL via Sequelize).
 * Les dépôts concrets héritent de cette classe pour bénéficier
 * des opérations CRUD génériques.
 * ============================================================
 */

class DepotDeBase {
  /**
   * @param {import('sequelize').Model} modele - Le modèle Sequelize à manipuler
   */
  constructor(modele) {
    if (new.target === DepotDeBase) {
      throw new Error('DepotDeBase est abstrait et ne peut pas être instancié directement.');
    }
    this.modele = modele;
  }

  /**
   * Récupère tous les enregistrements avec options de filtrage.
   * @param {object} options - Options Sequelize (where, include, order, etc.)
   * @returns {Promise<Array>}
   */
  async trouverTous(options = {}) {
    return this.modele.findAll(options);
  }

  /**
   * Recherche un enregistrement par son identifiant.
   * @param {number} id - Identifiant primaire
   * @param {object} options - Options Sequelize supplémentaires
   * @returns {Promise<object|null>}
   */
  async trouverParId(id, options = {}) {
    return this.modele.findByPk(id, options);
  }

  /**
   * Crée un nouvel enregistrement.
   * @param {object} donnees - Données de l'enregistrement à créer
   * @returns {Promise<object>} L'enregistrement créé
   */
  async creer(donnees) {
    return this.modele.create(donnees);
  }

  /**
   * Met à jour un enregistrement existant.
   * @param {number} id - Identifiant de l'enregistrement
   * @param {object} donnees - Nouvelles données
   * @returns {Promise<object|null>} L'enregistrement mis à jour
   */
  async mettreAJour(id, donnees) {
    const enregistrement = await this.modele.findByPk(id);
    if (!enregistrement) return null;
    return enregistrement.update(donnees);
  }

  /**
   * Supprime un enregistrement par son identifiant.
   * @param {number} id - Identifiant de l'enregistrement
   * @returns {Promise<boolean>} true si supprimé, false sinon
   */
  async supprimer(id) {
    const nombreSupprime = await this.modele.destroy({ where: { id } });
    return nombreSupprime > 0;
  }

  /**
   * Recherche un enregistrement selon des critères.
   * @param {object} criteres - Critères de recherche (clause where)
   * @returns {Promise<object|null>}
   */
  async trouverUn(criteres) {
    return this.modele.findOne({ where: criteres });
  }
}

module.exports = DepotDeBase;
