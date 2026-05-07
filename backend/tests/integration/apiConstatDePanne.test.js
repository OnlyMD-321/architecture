/**
 * ============================================================
 * TEST D'INTÉGRATION — API Constats de Panne
 * ============================================================
 * Vérifie que l'API Express traite correctement une requête
 * POST pour créer un constat de panne et renvoie un statut 201
 * avec l'enregistrement inséré en base de données.
 *
 * Utilise Supertest pour simuler les requêtes HTTP et
 * une base de données PostgreSQL réelle (ou de test).
 * ============================================================
 */

const request = require('supertest');
const { app } = require('../../src/app');
const BaseDeDonnees = require('../../src/config/BaseDeDonnees');
const { Ressource, Fournisseur, ConstatDePanne } = require('../../src/models');

describe('API Constats de Panne — Tests d\'intégration', () => {
  let ressourceTest;
  let fournisseurTest;

  /**
   * Avant tous les tests : synchroniser la base de données de test
   * et créer les données prérequises (fournisseur + ressource).
   */
  beforeAll(async () => {
    const baseDeDonnees = BaseDeDonnees.obtenirInstance();
    await baseDeDonnees.synchroniser({ force: true });

    /** Création d'un fournisseur de test */
    fournisseurTest = await Fournisseur.create({
      nom: 'Fournisseur Test Intégration',
      adresse: '123 Rue de Test, Casablanca',
      telephone: '0522-000000',
      statut: 'actif',
    });

    /** Création d'une ressource de test (ordinateur) */
    ressourceTest = await Ressource.create({
      nom: 'PC Test Intégration',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 8500.00,
      fournisseur_id: fournisseurTest.id,
      etat: 'en_service',
      specifications: {
        cpu: 'Intel Core i5-12400',
        ram: '8 Go DDR4',
        hdd: '256 Go SSD',
      },
    });
  });

  /**
   * Après tous les tests : nettoyer la base de données
   * et fermer la connexion.
   */
  afterAll(async () => {
    const baseDeDonnees = BaseDeDonnees.obtenirInstance();
    await baseDeDonnees.obtenirSequelize().close();
  });

  test('POST /api/constats — doit créer un constat et retourner 201', async () => {
    /**
     * ARRANGEMENT : Préparation des données du constat de panne.
     * La ressource de test existe déjà en base via beforeAll.
     */
    const donneesConstat = {
      ressource_id: ressourceTest.id,
      date_constat: '2026-03-21',
      nature_panne: 'materielle',
      description: 'Écran affiche des artefacts graphiques intermittents.',
      frequence: 'occasionnelle',
      urgence: 'moyenne',
    };

    /**
     * ACTION : Envoi de la requête POST à l'API.
     */
    const reponse = await request(app)
      .post('/api/constats')
      .send(donneesConstat)
      .expect('Content-Type', /json/);

    /**
     * ASSERTION : Le serveur doit renvoyer un statut 201 (créé)
     * avec les données de l'enregistrement.
     */
    expect(reponse.status).toBe(201);
    expect(reponse.body.succes).toBe(true);
    expect(reponse.body.donnees).toBeDefined();
    expect(reponse.body.donnees.id).toBeDefined();
    expect(reponse.body.donnees.ressource_id).toBe(ressourceTest.id);
    expect(reponse.body.donnees.nature_panne).toBe('materielle');
    expect(reponse.body.donnees.description).toContain('artefacts graphiques');
    expect(reponse.body.donnees.frequence).toBe('occasionnelle');

    /**
     * VÉRIFICATION SUPPLÉMENTAIRE :
     * S'assurer que l'enregistrement existe réellement en base de données.
     */
    const constatEnBase = await ConstatDePanne.findByPk(reponse.body.donnees.id);
    expect(constatEnBase).not.toBeNull();
    expect(constatEnBase.nature_panne).toBe('materielle');
  });

  test('POST /api/constats — doit retourner 400 si les champs obligatoires manquent', async () => {
    /**
     * Envoi d'une requête avec des données incomplètes
     * pour vérifier la validation côté contrôleur.
     */
    const donneesIncompletes = {
      ressource_id: ressourceTest.id,
      /* nature_panne et description manquants */
    };

    const reponse = await request(app)
      .post('/api/constats')
      .send(donneesIncompletes)
      .expect('Content-Type', /json/);

    expect(reponse.status).toBe(400);
    expect(reponse.body.succes).toBe(false);
    expect(reponse.body.message).toContain('obligatoires');
  });

  test('POST /api/constats — doit retourner 404 si la ressource n\'existe pas', async () => {
    const donneesConstat = {
      ressource_id: 99999,
      nature_panne: 'logicielle',
      description: 'Test avec ressource inexistante.',
      frequence: 'premiere_fois',
      urgence: 'basse',
    };

    const reponse = await request(app)
      .post('/api/constats')
      .send(donneesConstat)
      .expect('Content-Type', /json/);

    expect(reponse.status).toBe(404);
    expect(reponse.body.succes).toBe(false);
    expect(reponse.body.message).toContain('introuvable');
  });

  test('GET /api/constats — doit lister les constats existants', async () => {
    const reponse = await request(app)
      .get('/api/constats')
      .expect('Content-Type', /json/);

    expect(reponse.status).toBe(200);
    expect(reponse.body.succes).toBe(true);
    expect(Array.isArray(reponse.body.donnees)).toBe(true);
  });

  test('POST /api/constats — règle métier : panne d\'imprimante forcément matérielle', async () => {
    /**
     * ARRANGEMENT : création d'une ressource de type "imprimante".
     * Le cahier des charges impose que les pannes d'imprimante
     * soient strictement matérielles ; toute soumission avec
     * "logicielle" doit être refusée par l'API avec un code 400.
     */
    const imprimanteTest = await Ressource.create({
      nom: 'Imprimante Test Intégration',
      type: 'imprimante',
      marque: 'Canon',
      prix_unitaire_mad: 3200.0,
      fournisseur_id: fournisseurTest.id,
      etat: 'en_service',
      specifications: {
        vitesse_impression: '25 ppm',
        resolution: '1200x1200 dpi',
      },
    });

    const constatInvalide = {
      ressource_id: imprimanteTest.id,
      nature_panne: 'logicielle',
      description: 'Tentative de signaler une panne logicielle.',
      frequence: 'occasionnelle',
      urgence: 'moyenne',
    };

    const reponse = await request(app)
      .post('/api/constats')
      .send(constatInvalide)
      .expect('Content-Type', /json/);

    expect(reponse.status).toBe(400);
    expect(reponse.body.succes).toBe(false);
    expect(reponse.body.message).toMatch(/imprimante.*matérielle/i);
  });
});
