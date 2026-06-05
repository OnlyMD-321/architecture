const { Router } = require('express');
const controleur = require('../controllers/ControleurFournisseur');
const auth = require('../middlewares/authentification');
const autoriser = require('../middlewares/autorisation');

const routeur = Router();

routeur.get('/',                    auth, controleur.listerFournisseurs);
routeur.post('/',                   auth, autoriser('admin', 'responsable'), controleur.ajouterFournisseur);
routeur.post('/:id/valider-offre',  auth, autoriser('admin', 'responsable'), controleur.validerOffre);
routeur.patch('/:id/liste-noire',   auth, autoriser('admin', 'responsable'), controleur.mettreEnListeNoire);

module.exports = routeur;
