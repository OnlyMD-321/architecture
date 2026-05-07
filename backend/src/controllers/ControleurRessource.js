/**
 * ============================================================
 * COUCHE CONTRÔLEUR — Contrôleur des Ressources (MVC)
 * ============================================================
 * Reçoit les requêtes HTTP, les valide, puis délègue au
 * Service approprié. Ne contient AUCUNE logique métier.
 * ============================================================
 */

const ServiceRessource = require('../services/ServiceRessource');

const serviceRessource = new ServiceRessource();

/**
 * GET /api/ressources — Lister toutes les ressources
 */
async function listerRessources(req, res) {
  try {
    const { type } = req.query;

    /** Filtrage optionnel par type de ressource */
    const ressources = type
      ? await serviceRessource.listerParType(type)
      : await serviceRessource.listerRessources();

    return res.status(200).json({
      succes: true,
      donnees: ressources,
      total: ressources.length,
    });
  } catch (erreur) {
    console.error('Erreur lors de la récupération des ressources :', erreur.message);
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur lors de la récupération des ressources.',
    });
  }
}

/**
 * GET /api/ressources/:id — Obtenir une ressource par ID
 */
async function obtenirRessource(req, res) {
  try {
    const { id } = req.params;
    const ressource = await serviceRessource.obtenirRessource(parseInt(id, 10));

    return res.status(200).json({
      succes: true,
      donnees: ressource,
    });
  } catch (erreur) {
    /** Gestion de l'erreur "introuvable" */
    if (erreur.message.includes('introuvable')) {
      return res.status(404).json({
        succes: false,
        message: erreur.message,
      });
    }
    console.error('Erreur lors de la récupération de la ressource :', erreur.message);
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

/**
 * POST /api/ressources — Ajouter une nouvelle ressource
 * Utilise le Factory Method via le service pour la création.
 */
async function ajouterRessource(req, res) {
  try {
    /** Validation minimale des champs obligatoires */
    const { nom, type, prix_unitaire_mad } = req.body;
    if (!nom || !type || prix_unitaire_mad === undefined) {
      return res.status(400).json({
        succes: false,
        message: 'Les champs nom, type et prix_unitaire_mad sont obligatoires.',
      });
    }

    const nouvelleRessource = await serviceRessource.ajouterRessource(req.body);

    return res.status(201).json({
      succes: true,
      message: 'Ressource créée avec succès.',
      donnees: nouvelleRessource,
    });
  } catch (erreur) {
    /** Gestion des erreurs métier (liste noire, type inconnu, etc.) */
    if (
      erreur.message.includes('liste noire') ||
      erreur.message.includes('Type de ressource inconnu') ||
      erreur.message.includes('obligatoires')
    ) {
      return res.status(400).json({
        succes: false,
        message: erreur.message,
      });
    }
    console.error('Erreur lors de la création de la ressource :', erreur.message);
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

/**
 * PUT /api/ressources/:id — Mettre à jour une ressource
 */
async function mettreAJourRessource(req, res) {
  try {
    const { id } = req.params;
    const ressource = await serviceRessource.mettreAJourRessource(parseInt(id, 10), req.body);

    return res.status(200).json({
      succes: true,
      message: 'Ressource mise à jour avec succès.',
      donnees: ressource,
    });
  } catch (erreur) {
    if (erreur.message.includes('introuvable')) {
      return res.status(404).json({ succes: false, message: erreur.message });
    }
    return res.status(500).json({ succes: false, message: 'Erreur interne du serveur.' });
  }
}

/**
 * DELETE /api/ressources/:id — Supprimer une ressource
 */
async function supprimerRessource(req, res) {
  try {
    const { id } = req.params;
    await serviceRessource.supprimerRessource(parseInt(id, 10));

    return res.status(200).json({
      succes: true,
      message: 'Ressource supprimée avec succès.',
    });
  } catch (erreur) {
    if (erreur.message.includes('introuvable')) {
      return res.status(404).json({ succes: false, message: erreur.message });
    }
    return res.status(500).json({ succes: false, message: 'Erreur interne du serveur.' });
  }
}

module.exports = {
  listerRessources,
  obtenirRessource,
  ajouterRessource,
  mettreAJourRessource,
  supprimerRessource,
};
