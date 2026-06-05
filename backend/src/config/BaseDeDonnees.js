/**
 * ============================================================
 * PATRON SINGLETON — Connexion à la base de données
 * ============================================================
 * Ce module implémente le patron Singleton afin de garantir
 * qu'une seule instance de connexion Sequelize existe durant
 * tout le cycle de vie de l'application. Cela évite la
 * multiplication des connexions vers PostgreSQL.
 * ============================================================
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

class BaseDeDonnees {
  /** Référence statique privée vers l'instance unique */
  static #instance = null;

  /**
   * Le constructeur est rendu privé par convention.
   * Il ne doit JAMAIS être appelé directement depuis l'extérieur.
   */
  constructor() {
    if (BaseDeDonnees.#instance) {
      throw new Error(
        'Erreur : utilisez BaseDeDonnees.obtenirInstance() au lieu de new BaseDeDonnees()'
      );
    }

    /**
     * En environnement de test, on utilise SQLite en mémoire afin
     * que les tests Jest soient totalement isolés et ne dépendent
     * pas d'une instance PostgreSQL en cours d'exécution.
     * En production / développement, on se connecte à PostgreSQL
     * via les variables d'environnement.
     */
    if (process.env.NODE_ENV === 'test') {
      this.sequelize = new Sequelize('sqlite::memory:', {
        dialect: 'sqlite',
        logging: false,
      });
    } else if (process.env.DATABASE_URL) {
      /** Connexion via URL unique (Supabase, Render, Railway, etc.) */
      this.sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      });
    } else {
      /** Connexion via variables individuelles (Docker Compose, local) */
      this.sequelize = new Sequelize(
        process.env.DB_NAME || 'gestion_ressources',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'postgres',
        {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT, 10) || 5432,
          dialect: 'postgres',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
          pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
        }
      );
    }
  }

  /**
   * Point d'accès unique au Singleton.
   * Crée l'instance lors du premier appel, puis la retourne
   * systématiquement par la suite.
   * @returns {BaseDeDonnees} L'instance unique de la base de données
   */
  static obtenirInstance() {
    if (!BaseDeDonnees.#instance) {
      BaseDeDonnees.#instance = new BaseDeDonnees();
    }
    return BaseDeDonnees.#instance;
  }

  /**
   * Retourne l'objet Sequelize pour utilisation dans les modèles.
   * @returns {Sequelize}
   */
  obtenirSequelize() {
    return this.sequelize;
  }

  /**
   * Vérifie la connexion à la base de données.
   */
  async testerConnexion() {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Connexion à la base de données établie avec succès.');
    } catch (erreur) {
      console.error('❌ Impossible de se connecter à la base de données :', erreur.message);
      throw erreur;
    }
  }

  /**
   * Synchronise tous les modèles avec la base de données.
   * @param {object} options - Options de synchronisation Sequelize
   */
  async synchroniser(options = {}) {
    await this.sequelize.sync(options);
    console.log('✅ Modèles synchronisés avec la base de données.');
  }
}

module.exports = BaseDeDonnees;
