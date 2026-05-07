/**
 * ============================================================
 * COUCHE CONTRÔLEUR — Contrôleur des Constats de Panne (MVC)
 * ============================================================
 * Gère les requêtes HTTP relatives aux rapports de maintenance.
 * Délègue au ServiceConstatDePanne pour la logique métier.
 * ============================================================
 */

const ServiceConstatDePanne = require('../services/ServiceConstatDePanne');

const serviceConstat = new ServiceConstatDePanne();

/**
 * GET /api/constats — Lister tous les constats de panne
 */
async function listerConstats(req, res) {
  try {
    const constats = await serviceConstat.listerConstats();
    return res.status(200).json({
      succes: true,
      donnees: constats,
      total: constats.length,
    });
  } catch (erreur) {
    console.error('Erreur lors de la récupération des constats :', erreur.message);
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

/**
 * POST /api/constats — Enregistrer un nouveau constat de panne
 */
async function enregistrerConstat(req, res) {
  try {
    const { ressource_id, nature_panne, description } = req.body;

    /** Validation des champs obligatoires */
    if (!ressource_id || !nature_panne || !description) {
      return res.status(400).json({
        succes: false,
        message: 'Les champs ressource_id, nature_panne et description sont obligatoires.',
      });
    }

    const constat = await serviceConstat.enregistrerConstat(req.body);

    return res.status(201).json({
      succes: true,
      message: 'Constat de panne enregistré avec succès.',
      donnees: constat,
    });
  } catch (erreur) {
    if (erreur.message.includes('introuvable')) {
      return res.status(404).json({
        succes: false,
        message: erreur.message,
      });
    }
    /** Erreur métier (ex : panne d'imprimante non-matérielle) */
    if (erreur.message.includes('Règle métier')) {
      return res.status(400).json({
        succes: false,
        message: erreur.message,
      });
    }
    console.error('Erreur lors de l\'enregistrement du constat :', erreur.message);
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

/**
 * GET /api/constats/ressource/:ressourceId — Constats pour une ressource
 */
async function listerConstatsParRessource(req, res) {
  try {
    const { ressourceId } = req.params;
    const constats = await serviceConstat.listerConstatsParRessource(parseInt(ressourceId, 10));

    return res.status(200).json({
      succes: true,
      donnees: constats,
      total: constats.length,
    });
  } catch (erreur) {
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

module.exports = {
  listerConstats,
  enregistrerConstat,
  listerConstatsParRessource,
};
