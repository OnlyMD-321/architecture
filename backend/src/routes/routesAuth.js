const { Router } = require('express');
const { seConnecter, obtenirProfil } = require('../controllers/ControleurAuth');
const authentifier = require('../middlewares/authentification');

const routeur = Router();

routeur.post('/connexion', seConnecter);
routeur.get('/moi', authentifier, obtenirProfil);

module.exports = routeur;
