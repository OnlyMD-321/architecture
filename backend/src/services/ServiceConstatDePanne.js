/**
 * ============================================================
 * COUCHE SERVICE — Service des Constats de Panne
 * ============================================================
 * Logique métier pour la gestion de la maintenance et
 * des rapports de pannes matérielles/logicielles.
 * ============================================================
 */

const DepotConstatDePanne = require('../repositories/DepotConstatDePanne');
const DepotRessource = require('../repositories/DepotRessource');

class ServiceConstatDePanne {
  constructor() {
    this.depotConstat = new DepotConstatDePanne();
    this.depotRessource = new DepotRessource();
  }

  /**
   * Récupère tous les constats de panne avec les ressources associées.
   * @returns {Promise<Array>}
   */
  async listerConstats() {
    return this.depotConstat.trouverTousAvecRessource();
  }

  /**
   * Enregistre un nouveau constat de panne.
   * Vérifie d'abord que la ressource existe, puis met à jour
   * son état en "en_panne".
   *
   * RÈGLE MÉTIER : pour une imprimante, la nature de la panne
   * est strictement matérielle (les imprimantes ne possèdent pas
   * de logiciel exploitable côté faculté).
   *
   * @param {object} donnees - Données du constat de panne
   * @returns {Promise<object>} Le constat créé
   * @throws {Error} Si la ressource est introuvable ou si la règle
   *                 imprimante / panne matérielle est violée
   */
  async enregistrerConstat(donnees) {
    /** Vérification de l'existence de la ressource */
    const ressource = await this.depotRessource.trouverParId(donnees.ressource_id);
    if (!ressource) {
      throw new Error(
        `Ressource avec l'identifiant ${donnees.ressource_id} introuvable.`
      );
    }

    /**
     * Application de la règle métier spécifique aux imprimantes :
     * une panne d'imprimante doit obligatoirement être de nature
     * matérielle (cf. cahier des charges : "Printer faults are
     * strictly hardware").
     */
    if (ressource.type === 'imprimante' && donnees.nature_panne !== 'materielle') {
      throw new Error(
        'Règle métier violée : une panne d\'imprimante doit être de nature matérielle.'
      );
    }

    /** Mise à jour de l'état de la ressource vers "en_panne" */
    await this.depotRessource.mettreAJour(donnees.ressource_id, { etat: 'en_panne' });

    /** Création du constat via le dépôt */
    return this.depotConstat.creerConstat(donnees);
  }

  /**
   * Récupère les constats de panne pour une ressource donnée.
   * @param {number} ressourceId - Identifiant de la ressource
   * @returns {Promise<Array>}
   */
  async listerConstatsParRessource(ressourceId) {
    return this.depotConstat.trouverParRessource(ressourceId);
  }
}

module.exports = ServiceConstatDePanne;
