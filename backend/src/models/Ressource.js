/**
 * Modèle Sequelize — Ressource (entité de base)
 * Représente une ressource matérielle générique.
 * Les types spécifiques (Ordinateur, Imprimante) sont gérés
 * via la colonne "type" et les champs JSON "specifications".
 */

const { DataTypes } = require('sequelize');
const BaseDeDonnees = require('../config/BaseDeDonnees');

const sequelize = BaseDeDonnees.obtenirInstance().obtenirSequelize();

const Ressource = sequelize.define(
  'Ressource',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identifiant unique de la ressource',
    },
    /** Nom ou libellé de la ressource matérielle */
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true },
      comment: 'Nom ou libellé de la ressource',
    },
    /** Type discriminant pour le patron Factory Method */
    type: {
      type: DataTypes.ENUM('ordinateur', 'imprimante'),
      allowNull: false,
      comment: 'Type de ressource (ordinateur ou imprimante)',
    },
    /** Marque du matériel */
    marque: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Marque du matériel',
    },
    /**
     * Prix unitaire en Dirhams marocains (MAD).
     * Toutes les transactions financières sont strictement en MAD.
     */
    prix_unitaire_mad: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
      comment: 'Prix unitaire en Dirhams (MAD)',
    },
    /** Spécifications techniques — stockées en JSON selon le type */
    specifications: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Spécifications techniques (CPU/RAM/HDD pour ordinateur, vitesse/résolution pour imprimante)',
    },
    /** Référence vers le fournisseur */
    fournisseur_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'fournisseurs', key: 'id' },
      comment: 'Clé étrangère vers le fournisseur',
    },
    /** État de la ressource */
    etat: {
      type: DataTypes.ENUM('disponible', 'en_service', 'en_panne', 'reforme'),
      defaultValue: 'disponible',
      allowNull: false,
      comment: 'État actuel de la ressource',
    },
  },
  {
    tableName: 'ressources',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification',
  }
);

module.exports = Ressource;
