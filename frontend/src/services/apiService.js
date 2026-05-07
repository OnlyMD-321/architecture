/**
 * Service API — Couche de communication avec le backend
 * Centralise tous les appels HTTP vers l'API Express.
 */

const URL_BASE_API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Récupère la liste de toutes les ressources matérielles.
 * @param {string} [filtre] - Filtre optionnel par type ('ordinateur' ou 'imprimante')
 * @returns {Promise<object>} Réponse de l'API
 */
export async function recupererRessources(filtre = '') {
  const parametres = filtre ? `?type=${encodeURIComponent(filtre)}` : '';
  const reponse = await fetch(`${URL_BASE_API}/ressources${parametres}`);
  if (!reponse.ok) {
    throw new Error('Erreur lors de la récupération des ressources.');
  }
  return reponse.json();
}

/**
 * Crée une nouvelle ressource matérielle via l'API.
 * @param {object} donneesRessource - Données de la ressource
 * @returns {Promise<object>} Réponse de l'API
 */
export async function creerRessource(donneesRessource) {
  const reponse = await fetch(`${URL_BASE_API}/ressources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donneesRessource),
  });
  if (!reponse.ok) {
    const erreur = await reponse.json();
    throw new Error(erreur.message || 'Erreur lors de la création de la ressource.');
  }
  return reponse.json();
}

/**
 * Récupère la liste des fournisseurs.
 * @returns {Promise<object>}
 */
export async function recupererFournisseurs() {
  const reponse = await fetch(`${URL_BASE_API}/fournisseurs`);
  if (!reponse.ok) {
    throw new Error('Erreur lors de la récupération des fournisseurs.');
  }
  return reponse.json();
}

/**
 * Enregistre un constat de panne.
 * @param {object} donneesConstat - Données du constat
 * @returns {Promise<object>}
 */
export async function enregistrerConstat(donneesConstat) {
  const reponse = await fetch(`${URL_BASE_API}/constats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donneesConstat),
  });
  if (!reponse.ok) {
    const erreur = await reponse.json();
    throw new Error(erreur.message || 'Erreur lors de l\'enregistrement du constat.');
  }
  return reponse.json();
}
