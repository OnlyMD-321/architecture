/**
 * ============================================================
 * COUCHE SERVICE — Service des Ressources
 * ============================================================
 * Contient toute la logique métier liée aux ressources.
 * Le contrôleur délègue les opérations au service, qui utilise
 * le dépôt (Repository) pour l'accès aux données et la fabrique
 * (Factory) pour la création d'objets.
 * ============================================================
 */

const DepotRessource = require('../repositories/DepotRessource');
const DepotFournisseur = require('../repositories/DepotFournisseur');
const { fabriquerRessource } = require('../factories/FabriqueRessource');

class ServiceRessource {
  constructor() {
    /** Injection des dépôts nécessaires */
    this.depotRessource = new DepotRessource();
    this.depotFournisseur = new DepotFournisseur();
  }

  /**
   * Récupère l'inventaire complet des ressources matérielles.
   * @returns {Promise<Array>} Liste de toutes les ressources avec fournisseur
   */
  async listerRessources() {
    return this.depotRessource.trouverToutesAvecFournisseur();
  }

  /**
   * Récupère une ressource spécifique par son identifiant.
   * @param {number} id - Identifiant de la ressource
   * @returns {Promise<object>}
   * @throws {Error} Si la ressource n'existe pas
   */
  async obtenirRessource(id) {
    const ressource = await this.depotRessource.trouverParId(id);
    if (!ressource) {
      throw new Error(`Ressource avec l'identifiant ${id} introuvable.`);
    }
    return ressource;
  }

  /**
   * Crée une nouvelle ressource matérielle.
   *
   * RÈGLE MÉTIER : Si un fournisseur est spécifié, on vérifie
   * d'abord qu'il n'est PAS sur la liste noire. Si c'est le cas,
   * l'offre est rejetée automatiquement.
   *
   * Utilise le patron Factory Method pour construire l'objet
   * ressource approprié selon son type.
   *
   * @param {object} donnees - Données de la requête
   * @returns {Promise<object>} La ressource créée
   * @throws {Error} Si le fournisseur est en liste noire
   */
  async ajouterRessource(donnees) {
    /** Vérification de la règle métier : rejet si fournisseur en liste noire */
    if (donnees.fournisseur_id) {
      const estListeNoire = await this.depotFournisseur.estEnListeNoire(donnees.fournisseur_id);
      if (estListeNoire) {
        throw new Error(
          'Offre rejetée : le fournisseur est actuellement sur la liste noire. ' +
          'Aucune transaction ne peut être effectuée avec ce fournisseur.'
        );
      }
    }

    /** Utilisation du patron Factory Method pour créer la ressource */
    const donneesRessource = fabriquerRessource(donnees.type, donnees);

    /** Persistance via le dépôt (Repository Pattern) */
    return this.depotRessource.creerAvecSpecifications(donneesRessource);
  }

  /**
   * Filtre les ressources par type matériel.
   * @param {string} type - 'ordinateur' ou 'imprimante'
   * @returns {Promise<Array>}
   */
  async listerParType(type) {
    return this.depotRessource.trouverParType(type);
  }

  /**
   * Met à jour une ressource existante.
   * @param {number} id - Identifiant de la ressource
   * @param {object} donnees - Nouvelles données
   * @returns {Promise<object>}
   */
  async mettreAJourRessource(id, donnees) {
    const ressource = await this.depotRessource.mettreAJour(id, donnees);
    if (!ressource) {
      throw new Error(`Ressource avec l'identifiant ${id} introuvable.`);
    }
    return ressource;
  }

  /**
   * Supprime une ressource.
   * @param {number} id - Identifiant de la ressource
   * @returns {Promise<boolean>}
   */
  async supprimerRessource(id) {
    const supprime = await this.depotRessource.supprimer(id);
    if (!supprime) {
      throw new Error(`Ressource avec l'identifiant ${id} introuvable.`);
    }
    return true;
  }
}

module.exports = ServiceRessource;
