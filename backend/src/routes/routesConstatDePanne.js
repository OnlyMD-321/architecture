/**
 * Routes — Constats de Panne (Maintenance)
 * Définit les endpoints REST pour les rapports de pannes.
 */

const { Router } = require('express');
const controleur = require('../controllers/ControleurConstatDePanne');

const routeur = Router();

/** Lister tous les constats de panne */
routeur.get('/', controleur.listerConstats);

/** Enregistrer un nouveau constat de panne */
routeur.post('/', controleur.enregistrerConstat);

/** Lister les constats pour une ressource spécifique */
routeur.get('/ressource/:ressourceId', controleur.listerConstatsParRessource);

module.exports = routeur;
