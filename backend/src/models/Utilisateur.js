const { DataTypes } = require('sequelize');
const BaseDeDonnees = require('../config/BaseDeDonnees');

const sequelize = BaseDeDonnees.obtenirInstance().obtenirSequelize();

const Utilisateur = sequelize.define('Utilisateur', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  mot_de_passe_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: {
    type: DataTypes.ENUM('admin', 'responsable', 'technicien', 'lecteur'),
    allowNull: false,
    defaultValue: 'lecteur',
  },
}, {
  tableName: 'utilisateurs',
  createdAt: 'date_creation',
  updatedAt: 'date_modification',
});

module.exports = Utilisateur;
