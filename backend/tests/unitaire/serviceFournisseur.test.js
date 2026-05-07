/**
 * ============================================================
 * TEST UNITAIRE — ServiceFournisseur
 * ============================================================
 * Vérifie que la logique métier rejette strictement l'offre
 * d'un fournisseur ayant le statut "liste_noire".
 *
 * Utilise des mocks pour isoler la couche service des
 * dépendances externes (base de données).
 * ============================================================
 */

const ServiceFournisseur = require('../../src/services/ServiceFournisseur');

/** Mock du dépôt Fournisseur pour isoler le test de la base de données */
jest.mock('../../src/repositories/DepotFournisseur', () => {
  return jest.fn().mockImplementation(() => ({
    trouverParId: jest.fn(),
    trouverTous: jest.fn(),
    creer: jest.fn(),
    mettreEnListeNoire: jest.fn(),
  }));
});

describe('ServiceFournisseur — Validation des offres', () => {
  let serviceFournisseur;

  beforeEach(() => {
    /** Réinitialisation du service avant chaque test */
    serviceFournisseur = new ServiceFournisseur();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('doit REJETER l\'offre si le fournisseur est en liste noire', async () => {
    /**
     * ARRANGEMENT : Simulation d'un fournisseur sur liste noire.
     * Le dépôt retourne un fournisseur avec statut "liste_noire".
     */
    const fournisseurListeNoire = {
      id: 1,
      nom: 'Fournisseur Interdit SARL',
      statut: 'liste_noire',
    };

    serviceFournisseur.depotFournisseur.trouverParId.mockResolvedValue(fournisseurListeNoire);

    /**
     * ACTION & ASSERTION : La validation doit lever une erreur
     * contenant le message "liste noire" pour ce fournisseur.
     */
    await expect(
      serviceFournisseur.validerOffreFournisseur(1)
    ).rejects.toThrow('liste noire');

    /** Vérification que le dépôt a bien été consulté */
    expect(serviceFournisseur.depotFournisseur.trouverParId).toHaveBeenCalledWith(1);
  });

  test('doit ACCEPTER l\'offre si le fournisseur est actif', async () => {
    /**
     * ARRANGEMENT : Simulation d'un fournisseur actif et autorisé.
     */
    const fournisseurActif = {
      id: 2,
      nom: 'Fournisseur Fiable SA',
      statut: 'actif',
    };

    serviceFournisseur.depotFournisseur.trouverParId.mockResolvedValue(fournisseurActif);

    /**
     * ACTION : Validation de l'offre pour un fournisseur actif.
     * ASSERTION : Le service doit renvoyer true sans lever d'erreur.
     */
    const resultat = await serviceFournisseur.validerOffreFournisseur(2);
    expect(resultat).toBe(true);

    expect(serviceFournisseur.depotFournisseur.trouverParId).toHaveBeenCalledWith(2);
  });

  test('doit lever une erreur si le fournisseur n\'existe pas', async () => {
    /**
     * ARRANGEMENT : Le dépôt retourne null (fournisseur inexistant).
     */
    serviceFournisseur.depotFournisseur.trouverParId.mockResolvedValue(null);

    /**
     * ASSERTION : Le service doit signaler que le fournisseur est introuvable.
     */
    await expect(
      serviceFournisseur.validerOffreFournisseur(999)
    ).rejects.toThrow('introuvable');
  });
});

describe('ServiceFournisseur — Mise en liste noire', () => {
  let serviceFournisseur;

  beforeEach(() => {
    serviceFournisseur = new ServiceFournisseur();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('doit déléguer la mise en liste noire au dépôt avec le motif justificatif', async () => {
    const fournisseurModifie = {
      id: 3,
      nom: 'Fournisseur Douteux',
      statut: 'liste_noire',
      motif_liste_noire: 'Retards de livraison récurrents.',
    };

    serviceFournisseur.depotFournisseur.mettreEnListeNoire.mockResolvedValue(fournisseurModifie);

    const motif = 'Retards de livraison récurrents.';
    const resultat = await serviceFournisseur.mettreEnListeNoire(3, motif);

    expect(resultat.statut).toBe('liste_noire');
    /** Le motif est transmis au dépôt en plus de l'identifiant */
    expect(serviceFournisseur.depotFournisseur.mettreEnListeNoire).toHaveBeenCalledWith(
      3,
      motif
    );
  });

  test('doit REFUSER la mise en liste noire si aucun motif n\'est fourni', async () => {
    /**
     * Règle métier : un motif justificatif est obligatoire
     * pour conserver la traçabilité des décisions du Responsable
     * des ressources.
     */
    await expect(
      serviceFournisseur.mettreEnListeNoire(3, '')
    ).rejects.toThrow('motif est obligatoire');

    /** Aucun appel ne doit avoir été propagé au dépôt */
    expect(serviceFournisseur.depotFournisseur.mettreEnListeNoire).not.toHaveBeenCalled();
  });
});
