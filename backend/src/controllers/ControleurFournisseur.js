/**
 * ============================================================
 * COUCHE CONTRÔLEUR — Contrôleur des Fournisseurs (MVC)
 * ============================================================
 * Gère les requêtes HTTP relatives aux fournisseurs.
 * Délègue au ServiceFournisseur pour la logique métier.
 * ============================================================
 */

const ServiceFournisseur = require('../services/ServiceFournisseur');

const serviceFournisseur = new ServiceFournisseur();

/**
 * GET /api/fournisseurs — Lister tous les fournisseurs
 */
async function listerFournisseurs(req, res) {
  try {
    const fournisseurs = await serviceFournisseur.listerFournisseurs();
    return res.status(200).json({
      succes: true,
      donnees: fournisseurs,
      total: fournisseurs.length,
    });
  } catch (erreur) {
    console.error('Erreur lors de la récupération des fournisseurs :', erreur.message);
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

/**
 * POST /api/fournisseurs — Ajouter un fournisseur
 */
async function ajouterFournisseur(req, res) {
  try {
    const { nom } = req.body;
    if (!nom) {
      return res.status(400).json({
        succes: false,
        message: 'Le champ nom est obligatoire.',
      });
    }

    const fournisseur = await serviceFournisseur.ajouterFournisseur(req.body);
    return res.status(201).json({
      succes: true,
      message: 'Fournisseur créé avec succès.',
      donnees: fournisseur,
    });
  } catch (erreur) {
    console.error('Erreur lors de la création du fournisseur :', erreur.message);
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

/**
 * POST /api/fournisseurs/:id/valider-offre — Vérifier qu'un fournisseur peut faire une offre
 */
async function validerOffre(req, res) {
  try {
    const { id } = req.params;
    await serviceFournisseur.validerOffreFournisseur(parseInt(id, 10));

    return res.status(200).json({
      succes: true,
      message: 'Le fournisseur est autorisé à soumettre une offre.',
    });
  } catch (erreur) {
    if (erreur.message.includes('liste noire') || erreur.message.includes('introuvable')) {
      return res.status(400).json({
        succes: false,
        message: erreur.message,
      });
    }
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

/**
 * PATCH /api/fournisseurs/:id/liste-noire — Mettre un fournisseur en liste noire
 * Le corps de la requête doit contenir un "motif" justificatif.
 */
async function mettreEnListeNoire(req, res) {
  try {
    const { id } = req.params;
    const { motif } = req.body;

    const fournisseur = await serviceFournisseur.mettreEnListeNoire(
      parseInt(id, 10),
      motif
    );

    if (!fournisseur) {
      return res.status(404).json({
        succes: false,
        message: 'Fournisseur introuvable.',
      });
    }

    return res.status(200).json({
      succes: true,
      message: 'Fournisseur placé sur la liste noire.',
      donnees: fournisseur,
    });
  } catch (erreur) {
    /** Erreur de validation métier (motif manquant) */
    if (erreur.message.includes('motif')) {
      return res.status(400).json({ succes: false, message: erreur.message });
    }
    return res.status(500).json({
      succes: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

module.exports = {
  listerFournisseurs,
  ajouterFournisseur,
  validerOffre,
  mettreEnListeNoire,
};
