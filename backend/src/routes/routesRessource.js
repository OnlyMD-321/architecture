const { Router } = require('express');
const controleur = require('../controllers/ControleurRessource');
const auth = require('../middlewares/authentification');
const autoriser = require('../middlewares/autorisation');

const routeur = Router();

routeur.get('/',       auth, controleur.listerRessources);
routeur.get('/:id',    auth, controleur.obtenirRessource);
routeur.post('/',      auth, autoriser('admin', 'responsable'), controleur.ajouterRessource);
routeur.put('/:id',    auth, autoriser('admin', 'responsable'), controleur.mettreAJourRessource);
routeur.delete('/:id', auth, autoriser('admin', 'responsable'), controleur.supprimerRessource);

module.exports = routeur;
