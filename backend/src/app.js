/**
 * ============================================================
 * Point d'entrée principal — Application Express
 * ============================================================
 * Configure le serveur Express, enregistre les middlewares,
 * monte les routes, et initialise la connexion à la base
 * de données via le patron Singleton.
 *
 * Architecture : MVC / Contrôleur-Service-Route
 * - Routes     → définissent les endpoints
 * - Contrôleurs → reçoivent les requêtes, délèguent au service
 * - Services   → contiennent la logique métier
 * - Dépôts     → abstraient l'accès à la base de données
 * ============================================================
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const BaseDeDonnees = require('./config/BaseDeDonnees');

/** Import des routes */
const routesRessource = require('./routes/routesRessource');
const routesFournisseur = require('./routes/routesFournisseur');
const routesConstatDePanne = require('./routes/routesConstatDePanne');

/** Initialisation de l'application Express */
const app = express();
const PORT = process.env.PORT || 3001;

/* ============================================================
 * MIDDLEWARES
 * ============================================================ */

/** Autorisation des requêtes cross-origin (CORS) pour le frontend React */
app.use(cors());

/** Parsing automatique des corps de requête JSON */
app.use(express.json());

/** Parsing des données URL-encodées */
app.use(express.urlencoded({ extended: true }));

/* ============================================================
 * ROUTES — Montage des routeurs sur les préfixes API
 * ============================================================ */

app.use('/api/ressources', routesRessource);
app.use('/api/fournisseurs', routesFournisseur);
app.use('/api/constats', routesConstatDePanne);

/** Route de vérification de santé pour Docker healthcheck */
app.get('/api/sante', (_req, res) => {
  res.status(200).json({
    statut: 'en_ligne',
    horodatage: new Date().toISOString(),
    message: 'Le serveur de gestion des ressources matérielles fonctionne correctement.',
  });
});

/** Gestion des routes inexistantes */
app.use((_req, res) => {
  res.status(404).json({
    succes: false,
    message: 'Route non trouvée.',
  });
});

/* ============================================================
 * DÉMARRAGE DU SERVEUR
 * ============================================================ */

/**
 * Initialise la base de données (Singleton) puis démarre le serveur.
 * La synchronisation crée les tables si elles n'existent pas.
 */
async function demarrerServeur() {
  try {
    /** Obtention de l'instance unique de la base de données (Singleton) */
    const baseDeDonnees = BaseDeDonnees.obtenirInstance();
    await baseDeDonnees.testerConnexion();
    await baseDeDonnees.synchroniser();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 API disponible sur http://localhost:${PORT}/api`);
    });
  } catch (erreur) {
    console.error('❌ Échec du démarrage du serveur :', erreur.message);
    process.exit(1);
  }
}

/** Démarrage uniquement si le module est exécuté directement (pas en test) */
if (require.main === module) {
  demarrerServeur();
}

/** Export de l'app pour les tests avec Supertest */
module.exports = { app, demarrerServeur };
