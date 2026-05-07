/**
 * ============================================================
 * PATRON FACTORY METHOD — Fabrique de Ressources
 * ============================================================
 * Implémente le patron Factory Method pour instancier le bon
 * type de ressource (Ordinateur ou Imprimante) en fonction des
 * données reçues dans la requête.
 *
 * Ce patron permet d'encapsuler la logique de création et de
 * validation des spécifications techniques propres à chaque
 * type de matériel, tout en offrant un point d'entrée unique.
 * ============================================================
 */

/**
 * Classe abstraite représentant un créateur de ressource.
 * Chaque sous-classe concrète implémente la méthode "creerRessource".
 */
class CreateurRessource {
  /**
   * Méthode fabrique — doit être implémentée par les sous-classes.
   * @param {object} _donnees - Données brutes de la requête
   * @throws {Error} Si appelée directement sur la classe abstraite
   */
  creerRessource(_donnees) {
    throw new Error('La méthode creerRessource() doit être implémentée par la sous-classe.');
  }
}

/**
 * Fabrique concrète pour les ressources de type "Ordinateur".
 * Valide et structure les spécifications : CPU, RAM, HDD.
 */
class CreateurOrdinateur extends CreateurRessource {
  /**
   * Crée un objet ressource de type Ordinateur avec ses spécifications.
   * @param {object} donnees - Données contenant nom, marque, prix, CPU, RAM, HDD
   * @returns {object} Objet prêt pour l'insertion en base de données
   */
  creerRessource(donnees) {
    /** Validation des spécifications obligatoires pour un ordinateur */
    if (!donnees.cpu || !donnees.ram || !donnees.hdd) {
      throw new Error(
        'Les spécifications CPU, RAM et HDD sont obligatoires pour un ordinateur.'
      );
    }

    return {
      nom: donnees.nom,
      type: 'ordinateur',
      marque: donnees.marque,
      prix_unitaire_mad: donnees.prix_unitaire_mad,
      fournisseur_id: donnees.fournisseur_id || null,
      etat: donnees.etat || 'disponible',
      /** Spécifications techniques propres à l'ordinateur */
      specifications: {
        cpu: donnees.cpu,
        ram: donnees.ram,
        hdd: donnees.hdd,
      },
    };
  }
}

/**
 * Fabrique concrète pour les ressources de type "Imprimante".
 * Valide et structure les spécifications : vitesse d'impression, résolution.
 */
class CreateurImprimante extends CreateurRessource {
  /**
   * Crée un objet ressource de type Imprimante avec ses spécifications.
   * @param {object} donnees - Données contenant nom, marque, prix, vitesse, résolution
   * @returns {object} Objet prêt pour l'insertion en base de données
   */
  creerRessource(donnees) {
    /** Validation des spécifications obligatoires pour une imprimante */
    if (!donnees.vitesse_impression || !donnees.resolution) {
      throw new Error(
        'Les spécifications vitesse d\'impression et résolution sont obligatoires pour une imprimante.'
      );
    }

    return {
      nom: donnees.nom,
      type: 'imprimante',
      marque: donnees.marque,
      prix_unitaire_mad: donnees.prix_unitaire_mad,
      fournisseur_id: donnees.fournisseur_id || null,
      etat: donnees.etat || 'disponible',
      /** Spécifications techniques propres à l'imprimante */
      specifications: {
        vitesse_impression: donnees.vitesse_impression,
        resolution: donnees.resolution,
      },
    };
  }
}

/**
 * Point d'entrée principal de la fabrique.
 * Sélectionne le créateur approprié selon le type de ressource.
 *
 * @param {string} type - Le type de ressource à créer ('ordinateur' ou 'imprimante')
 * @param {object} donnees - Les données brutes de la requête
 * @returns {object} L'objet ressource structuré et validé
 * @throws {Error} Si le type de ressource est inconnu
 */
function fabriquerRessource(type, donnees) {
  /** Registre des créateurs — associe chaque type à sa fabrique concrète */
  const createurs = {
    ordinateur: new CreateurOrdinateur(),
    imprimante: new CreateurImprimante(),
  };

  const createur = createurs[type];
  if (!createur) {
    throw new Error(`Type de ressource inconnu : "${type}". Types valides : ordinateur, imprimante.`);
  }

  /** Délégation de la création au créateur concret (Factory Method) */
  return createur.creerRessource(donnees);
}

module.exports = {
  fabriquerRessource,
  CreateurRessource,
  CreateurOrdinateur,
  CreateurImprimante,
};
