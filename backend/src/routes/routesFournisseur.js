/**
 * Routes — Fournisseurs
 * Définit les endpoints REST pour la gestion des fournisseurs.
 */

const { Router } = require('express');
const controleur = require('../controllers/ControleurFournisseur');

const routeur = Router();

/** Lister tous les fournisseurs */
routeur.get('/', controleur.listerFournisseurs);

/** Ajouter un nouveau fournisseur */
routeur.post('/', controleur.ajouterFournisseur);

/** Valider qu'un fournisseur peut faire une offre (vérification liste noire) */
routeur.post('/:id/valider-offre', controleur.validerOffre);

/** Placer un fournisseur sur la liste noire */
routeur.patch('/:id/liste-noire', controleur.mettreEnListeNoire);

module.exports = routeur;
