/**
 * Fichier d'index des modèles — Associations entre entités
 * Centralise l'import de tous les modèles et définit les relations.
 */

const Fournisseur = require('./Fournisseur');
const Ressource = require('./Ressource');
const ConstatDePanne = require('./ConstatDePanne');

/* ============================================================
 * ASSOCIATIONS — Relations entre les modèles
 * ============================================================ */

/** Un fournisseur peut fournir plusieurs ressources */
Fournisseur.hasMany(Ressource, {
  foreignKey: 'fournisseur_id',
  as: 'ressources',
});

/** Une ressource appartient à un seul fournisseur */
Ressource.belongsTo(Fournisseur, {
  foreignKey: 'fournisseur_id',
  as: 'fournisseur',
});

/** Une ressource peut avoir plusieurs constats de panne */
Ressource.hasMany(ConstatDePanne, {
  foreignKey: 'ressource_id',
  as: 'constats',
});

/** Un constat de panne est lié à une seule ressource */
ConstatDePanne.belongsTo(Ressource, {
  foreignKey: 'ressource_id',
  as: 'ressource',
});

module.exports = {
  Fournisseur,
  Ressource,
  ConstatDePanne,
};
