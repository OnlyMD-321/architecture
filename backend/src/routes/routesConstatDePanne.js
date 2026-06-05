const { Router } = require('express');
const controleur = require('../controllers/ControleurConstatDePanne');
const auth = require('../middlewares/authentification');
const autoriser = require('../middlewares/autorisation');

const routeur = Router();

routeur.get('/',                          auth, controleur.listerConstats);
routeur.get('/ressource/:ressourceId',    auth, controleur.listerConstatsParRessource);
routeur.post('/',                         auth, autoriser('admin', 'responsable', 'technicien'), controleur.enregistrerConstat);

module.exports = routeur;
