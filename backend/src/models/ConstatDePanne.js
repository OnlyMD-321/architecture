/**
 * Modèle Sequelize — Constat de Panne
 * Représente un rapport de panne matérielle ou logicielle
 * associé à une ressource. Permet le suivi de la maintenance.
 */

const { DataTypes } = require('sequelize');
const BaseDeDonnees = require('../config/BaseDeDonnees');

const sequelize = BaseDeDonnees.obtenirInstance().obtenirSequelize();

const ConstatDePanne = sequelize.define(
  'ConstatDePanne',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identifiant unique du constat de panne',
    },
    /** Référence vers la ressource concernée */
    ressource_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'ressources', key: 'id' },
      comment: 'Clé étrangère vers la ressource en panne',
    },
    /** Date du constat */
    date_constat: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Date à laquelle la panne a été constatée',
    },
    /** Nature de la panne : matérielle ou logicielle */
    nature_panne: {
      type: DataTypes.ENUM('materielle', 'logicielle'),
      allowNull: false,
      comment: 'Nature de la panne (matérielle ou logicielle)',
    },
    /** Description détaillée de la panne */
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
      comment: 'Description détaillée de la panne observée',
    },
    /** Fréquence d'apparition de la panne */
    frequence: {
      type: DataTypes.ENUM('premiere_fois', 'occasionnelle', 'frequente', 'permanente'),
      allowNull: false,
      defaultValue: 'premiere_fois',
      comment: 'Fréquence d\'apparition de la panne',
    },
    /** Urgence du constat */
    urgence: {
      type: DataTypes.ENUM('basse', 'moyenne', 'haute', 'critique'),
      defaultValue: 'moyenne',
      allowNull: false,
      comment: 'Niveau d\'urgence de la panne',
    },
  },
  {
    tableName: 'constats_de_panne',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification',
  }
);

module.exports = ConstatDePanne;
