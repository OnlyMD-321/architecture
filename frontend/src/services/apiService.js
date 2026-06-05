const URL_BASE_API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

async function _gererReponse(reponse) {
  if (!reponse.ok) {
    let erreur = {};
    try { erreur = await reponse.json(); } catch {}
    throw new Error(erreur.message || `Erreur HTTP ${reponse.status}`);
  }
  return reponse.json();
}

export async function recupererRessources(filtre = '') {
  const parametres = filtre ? `?type=${encodeURIComponent(filtre)}` : '';
  return _gererReponse(await fetch(`${URL_BASE_API}/ressources${parametres}`));
}

export async function creerRessource(donneesRessource) {
  return _gererReponse(await fetch(`${URL_BASE_API}/ressources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donneesRessource),
  }));
}

export async function mettreAJourRessource(id, donneesRessource) {
  return _gererReponse(await fetch(`${URL_BASE_API}/ressources/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donneesRessource),
  }));
}

export async function supprimerRessource(id) {
  return _gererReponse(await fetch(`${URL_BASE_API}/ressources/${id}`, {
    method: 'DELETE',
  }));
}

export async function recupererFournisseurs() {
  return _gererReponse(await fetch(`${URL_BASE_API}/fournisseurs`));
}

export async function creerFournisseur(donneesFournisseur) {
  return _gererReponse(await fetch(`${URL_BASE_API}/fournisseurs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donneesFournisseur),
  }));
}

export async function mettreEnListeNoire(id, motif) {
  return _gererReponse(await fetch(`${URL_BASE_API}/fournisseurs/${id}/liste-noire`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motif }),
  }));
}

export async function enregistrerConstat(donneesConstat) {
  return _gererReponse(await fetch(`${URL_BASE_API}/constats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donneesConstat),
  }));
}

export async function recupererConstats() {
  return _gererReponse(await fetch(`${URL_BASE_API}/constats`));
}

export async function recupererConstatsRessource(id) {
  return _gererReponse(await fetch(`${URL_BASE_API}/constats/ressource/${id}`));
}
