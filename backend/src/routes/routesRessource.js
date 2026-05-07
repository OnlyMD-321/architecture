/**
 * Routes — Ressources matérielles
 * Définit les endpoints REST pour la gestion des ressources.
 */

const { Router } = require('express');
const controleur = require('../controllers/ControleurRessource');

const routeur = Router();

/** Lister toutes les ressources (avec filtre optionnel ?type=ordinateur) */
routeur.get('/', controleur.listerRessources);

/** Obtenir une ressource par son identifiant */
routeur.get('/:id', controleur.obtenirRessource);

/** Créer une nouvelle ressource (Factory Method côté service) */
routeur.post('/', controleur.ajouterRessource);

/** Mettre à jour une ressource existante */
routeur.put('/:id', controleur.mettreAJourRessource);

/** Supprimer une ressource */
routeur.delete('/:id', controleur.supprimerRessource);

module.exports = routeur;
