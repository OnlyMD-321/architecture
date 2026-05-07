/**
 * ============================================================
 * TEST UNITAIRE — ServiceRessource (règle "Liste Noire")
 * ============================================================
 * Vérifie que la logique d'ajout d'une nouvelle ressource
 * matérielle rejette explicitement toute offre provenant
 * d'un fournisseur inscrit sur la liste noire (cf. cahier
 * des charges : "le Responsable peut éliminer les fournisseurs
 * n'ayant pas respecté leurs engagements").
 *
 * Les dépôts (Repository) sont mockés afin que ce test ne
 * dépende d'aucune base de données réelle.
 * ============================================================
 */

const ServiceRessource = require('../../src/services/ServiceRessource');

/** Mock du dépôt Ressource — aucune écriture réelle ne doit avoir lieu */
jest.mock('../../src/repositories/DepotRessource', () =>
  jest.fn().mockImplementation(() => ({
    creerAvecSpecifications: jest.fn(),
    trouverToutesAvecFournisseur: jest.fn(),
    trouverParId: jest.fn(),
  }))
);

/** Mock du dépôt Fournisseur — pour simuler un fournisseur en liste noire */
jest.mock('../../src/repositories/DepotFournisseur', () =>
  jest.fn().mockImplementation(() => ({
    estEnListeNoire: jest.fn(),
  }))
);

describe('ServiceRessource — Application de la règle "Liste Noire"', () => {
  let serviceRessource;

  beforeEach(() => {
    serviceRessource = new ServiceRessource();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('doit REJETER l\'ajout d\'une ressource si le fournisseur est en liste noire', async () => {
    /**
     * ARRANGEMENT : le fournisseur n°42 est signalé comme étant
     * sur la liste noire par le dépôt.
     */
    serviceRessource.depotFournisseur.estEnListeNoire.mockResolvedValue(true);

    const donneesRessource = {
      nom: 'Poste de Travail Bureautique',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 8500,
      cpu: 'Intel Core i5-12400',
      ram: '16 Go DDR4',
      hdd: '512 Go SSD NVMe',
      fournisseur_id: 42,
    };

    /**
     * ACTION & ASSERTION : l'opération doit échouer avec un message
     * métier clair mentionnant la liste noire.
     */
    await expect(
      serviceRessource.ajouterRessource(donneesRessource)
    ).rejects.toThrow(/liste noire/i);

    /**
     * VÉRIFICATION : aucune écriture ne doit être tentée en base
     * de données — la règle métier court-circuite le flux avant
     * la persistance.
     */
    expect(
      serviceRessource.depotRessource.creerAvecSpecifications
    ).not.toHaveBeenCalled();

    /** Le dépôt fournisseur a bien été interrogé avec le bon ID */
    expect(serviceRessource.depotFournisseur.estEnListeNoire).toHaveBeenCalledWith(42);
  });

  test('doit AUTORISER l\'ajout si le fournisseur n\'est pas en liste noire', async () => {
    serviceRessource.depotFournisseur.estEnListeNoire.mockResolvedValue(false);

    const ressourceCreee = {
      id: 1,
      nom: 'Poste de Travail Bureautique',
      type: 'ordinateur',
    };
    serviceRessource.depotRessource.creerAvecSpecifications.mockResolvedValue(
      ressourceCreee
    );

    const resultat = await serviceRessource.ajouterRessource({
      nom: 'Poste de Travail Bureautique',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 8500,
      cpu: 'Intel Core i5-12400',
      ram: '16 Go DDR4',
      hdd: '512 Go SSD NVMe',
      fournisseur_id: 11,
    });

    expect(resultat).toEqual(ressourceCreee);
    expect(
      serviceRessource.depotRessource.creerAvecSpecifications
    ).toHaveBeenCalledTimes(1);
  });
});
