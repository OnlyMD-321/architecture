/**
 * ============================================================
 * Modèle Sequelize — Fournisseur
 * ============================================================
 * Représente un fournisseur de matériel informatique pour la
 * faculté. Conforme aux exigences fonctionnelles :
 *   - Localisation, adresse, site web, nom du responsable
 *     (informations obligatoires lors de l'inscription d'un
 *      nouveau fournisseur).
 *   - Statut (actif / liste_noire) avec motif obligatoire
 *     en cas de mise sur liste noire.
 * ============================================================
 */

const { DataTypes } = require('sequelize');
const BaseDeDonnees = require('../config/BaseDeDonnees');

const sequelize = BaseDeDonnees.obtenirInstance().obtenirSequelize();

const Fournisseur = sequelize.define(
  'Fournisseur',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identifiant unique du fournisseur',
    },
    /** Raison sociale du fournisseur */
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true },
      comment: 'Raison sociale du fournisseur',
    },
    /** Ville / localisation du fournisseur */
    ville: {
      type: DataTypes.STRING(120),
      allowNull: true,
      comment: 'Ville ou localisation principale du fournisseur',
    },
    /** Adresse postale complète */
    adresse: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Adresse postale complète du fournisseur',
    },
    /** Site web officiel du fournisseur */
    site_web: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrlOuVide(valeur) {
          if (valeur && !/^https?:\/\//i.test(valeur)) {
            throw new Error('Le site web doit commencer par http:// ou https://');
          }
        },
      },
      comment: 'URL du site officiel du fournisseur',
    },
    /** Nom du responsable / interlocuteur principal */
    nom_responsable: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nom du responsable (interlocuteur de la faculté)',
    },
    /** Numéro de téléphone */
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Numéro de téléphone du fournisseur',
    },
    /** Statut commercial — détermine la possibilité de soumettre une offre */
    statut: {
      type: DataTypes.ENUM('actif', 'liste_noire'),
      defaultValue: 'actif',
      allowNull: false,
      comment: 'Statut du fournisseur (actif ou sur liste noire)',
    },
    /**
     * Motif obligatoire lors d'une mise sur liste noire :
     * justifie le refus de toute offre future de ce fournisseur
     * (ex : retards de livraison, non-respect des engagements).
     */
    motif_liste_noire: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Justification de la mise sur liste noire du fournisseur',
    },
  },
  {
    tableName: 'fournisseurs',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification',
    validate: {
      /**
       * Règle métier : si le fournisseur est sur liste noire,
       * un motif doit obligatoirement accompagner la décision.
       */
      motifObligatoireSiListeNoire() {
        if (this.statut === 'liste_noire' && !this.motif_liste_noire) {
          throw new Error(
            'Un motif est obligatoire lors de la mise sur liste noire d\'un fournisseur.'
          );
        }
      },
    },
  }
);

module.exports = Fournisseur;
