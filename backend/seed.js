/**
 * Script de peuplement de la base de données
 * Exécuter avec : node seed.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const BaseDeDonnees = require('./src/config/BaseDeDonnees');
const { Fournisseur, Ressource, ConstatDePanne, Utilisateur } = require('./src/models');

/* ============================================================
 * DONNÉES — Fournisseurs (12 entrées : 9 actifs, 3 liste noire)
 * ============================================================ */
const FOURNISSEURS = [
  {
    nom: 'Dell Technologies Maroc',
    ville: 'Casablanca',
    adresse: '42 Boulevard Zerktouni, Casablanca 20100',
    site_web: 'https://www.dell.com/ma',
    nom_responsable: 'Youssef Benali',
    telephone: '+212-522-441100',
    statut: 'actif',
  },
  {
    nom: 'HP Solutions Maghreb',
    ville: 'Rabat',
    adresse: '15 Avenue Allal El Fassi, Rabat 10000',
    site_web: 'https://www.hp.com/ma',
    nom_responsable: 'Fatima Zahra Tahiri',
    telephone: '+212-537-772255',
    statut: 'actif',
  },
  {
    nom: 'Lenovo Afrique du Nord',
    ville: 'Casablanca',
    adresse: '88 Rue Mohamed Smiha, Casablanca 20330',
    site_web: 'https://www.lenovo.com/ma',
    nom_responsable: 'Karim Tazi',
    telephone: '+212-522-983300',
    statut: 'actif',
  },
  {
    nom: 'Canon Maroc Distribution',
    ville: 'Marrakech',
    adresse: '7 Avenue Mohammed VI, Marrakech 40000',
    site_web: 'https://www.canon.com/ma',
    nom_responsable: 'Nadia Chraibi',
    telephone: '+212-524-334455',
    statut: 'actif',
  },
  {
    nom: 'Epson Maghreb SARL',
    ville: 'Tanger',
    adresse: '23 Boulevard Mohammed V, Tanger 90000',
    site_web: 'https://www.epson.com/ma',
    nom_responsable: 'Omar Amrani',
    telephone: '+212-539-330011',
    statut: 'actif',
  },
  {
    nom: 'Acer Afrique Distribution',
    ville: 'Fès',
    adresse: '11 Rue Abdelkrim El Khattabi, Fès 30000',
    site_web: 'https://www.acer.com/ma',
    nom_responsable: 'Salma Kettani',
    telephone: '+212-535-629900',
    statut: 'actif',
  },
  {
    nom: 'Brother Maroc Bureau',
    ville: 'Agadir',
    adresse: '5 Avenue Hassan II, Agadir 80000',
    site_web: 'https://www.brother.com/ma',
    nom_responsable: 'Rachid Lahlou',
    telephone: '+212-528-842200',
    statut: 'actif',
  },
  {
    nom: 'Microsoft Certified Partner MA',
    ville: 'Casablanca',
    adresse: '200 Boulevard Al Qods, Casablanca 20430',
    site_web: 'https://partner.microsoft.com',
    nom_responsable: 'Houda Benkirane',
    telephone: '+212-522-950050',
    statut: 'actif',
  },
  {
    nom: 'InfoTech Solutions Maroc',
    ville: 'Meknès',
    adresse: '34 Avenue des FAR, Meknès 50000',
    site_web: 'https://www.infotech.ma',
    nom_responsable: 'Amine Ouhabi',
    telephone: '+212-535-512299',
    statut: 'actif',
  },
  {
    nom: 'MegaSupply SARL',
    ville: 'Casablanca',
    adresse: '9 Rue de la Résistance, Casablanca 20000',
    site_web: 'https://www.megasupply.ma',
    nom_responsable: 'Khalid Rhazal',
    telephone: '+212-522-111200',
    statut: 'liste_noire',
    motif_liste_noire: 'Livraisons systématiquement en retard de plus de 60 jours. Matériel reçu non conforme aux spécifications contractuelles. Refus de remboursement suite à deux commandes défectueuses.',
  },
  {
    nom: 'ProTech Import Export',
    ville: 'Oujda',
    adresse: '18 Avenue de Marrakech, Oujda 60000',
    site_web: 'https://www.protech-import.ma',
    nom_responsable: 'Driss Maarouf',
    telephone: '+212-536-687700',
    statut: 'liste_noire',
    motif_liste_noire: 'Facturation frauduleuse détectée. Produits de contrefaçon livrés avec fausses certifications CE. Plainte déposée auprès de l\'ONSSA.',
  },
  {
    nom: 'Budget Hardware DZ',
    ville: 'Oujda',
    adresse: '3 Boulevard Maghreb Arabe, Oujda 60100',
    site_web: 'https://www.budgethardware.dz',
    nom_responsable: 'Mourad Hadjadj',
    telephone: '+213-41-551234',
    statut: 'liste_noire',
    motif_liste_noire: 'Garanties non honorées. Trois pannes majeures sur des équipements achetés dans les 6 premiers mois. Support technique inexistant malgré contrat de maintenance signé.',
  },
];

/* ============================================================
 * DONNÉES — Ressources (40 entrées : 25 ordinateurs, 15 imprimantes)
 * ============================================================ */
const buildRessources = (fournisseurs) => {
  const dell  = fournisseurs.find(f => f.nom.includes('Dell'));
  const hp    = fournisseurs.find(f => f.nom.includes('HP'));
  const len   = fournisseurs.find(f => f.nom.includes('Lenovo'));
  const canon = fournisseurs.find(f => f.nom.includes('Canon'));
  const eps   = fournisseurs.find(f => f.nom.includes('Epson'));
  const acer  = fournisseurs.find(f => f.nom.includes('Acer'));
  const bro   = fournisseurs.find(f => f.nom.includes('Brother'));
  const info  = fournisseurs.find(f => f.nom.includes('InfoTech'));

  return [
    // ——— Ordinateurs ———
    {
      nom: 'Poste Direction Générale',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 18500.00,
      fournisseur_id: dell.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i9-13900K', ram: '64 Go DDR5', hdd: '2 To NVMe SSD' },
    },
    {
      nom: 'PC Bureau Comptabilité 01',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 9200.00,
      fournisseur_id: dell.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i5-12400', ram: '16 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'PC Bureau Comptabilité 02',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 9200.00,
      fournisseur_id: dell.id,
      etat: 'en_panne',
      specifications: { cpu: 'Intel Core i5-12400', ram: '16 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'PC Bureau Comptabilité 03',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 9200.00,
      fournisseur_id: dell.id,
      etat: 'disponible',
      specifications: { cpu: 'Intel Core i5-12400', ram: '16 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'Workstation Design Graphique',
      type: 'ordinateur',
      marque: 'HP',
      prix_unitaire_mad: 24000.00,
      fournisseur_id: hp.id,
      etat: 'en_service',
      specifications: { cpu: 'AMD Ryzen 9 7950X', ram: '128 Go DDR5', hdd: '4 To NVMe SSD' },
    },
    {
      nom: 'PC RH Recrutement',
      type: 'ordinateur',
      marque: 'HP',
      prix_unitaire_mad: 8750.00,
      fournisseur_id: hp.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i5-1235U', ram: '16 Go DDR4', hdd: '256 Go SSD' },
    },
    {
      nom: 'PC RH Formation',
      type: 'ordinateur',
      marque: 'HP',
      prix_unitaire_mad: 8750.00,
      fournisseur_id: hp.id,
      etat: 'disponible',
      specifications: { cpu: 'Intel Core i5-1235U', ram: '16 Go DDR4', hdd: '256 Go SSD' },
    },
    {
      nom: 'Laptop Commercial Terrain 01',
      type: 'ordinateur',
      marque: 'Lenovo',
      prix_unitaire_mad: 12300.00,
      fournisseur_id: len.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i7-1260P', ram: '16 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'Laptop Commercial Terrain 02',
      type: 'ordinateur',
      marque: 'Lenovo',
      prix_unitaire_mad: 12300.00,
      fournisseur_id: len.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i7-1260P', ram: '16 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'Laptop Commercial Terrain 03',
      type: 'ordinateur',
      marque: 'Lenovo',
      prix_unitaire_mad: 12300.00,
      fournisseur_id: len.id,
      etat: 'en_panne',
      specifications: { cpu: 'Intel Core i7-1260P', ram: '16 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'PC Salle de Conférence',
      type: 'ordinateur',
      marque: 'Lenovo',
      prix_unitaire_mad: 7500.00,
      fournisseur_id: len.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i3-12100', ram: '8 Go DDR4', hdd: '256 Go SSD' },
    },
    {
      nom: 'PC Réception Accueil',
      type: 'ordinateur',
      marque: 'Acer',
      prix_unitaire_mad: 6800.00,
      fournisseur_id: acer.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i3-1215U', ram: '8 Go DDR4', hdd: '256 Go SSD' },
    },
    {
      nom: 'PC Sécurité Surveillance',
      type: 'ordinateur',
      marque: 'Acer',
      prix_unitaire_mad: 7200.00,
      fournisseur_id: acer.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i5-1235U', ram: '16 Go DDR4', hdd: '1 To HDD' },
    },
    {
      nom: 'Serveur NAS Stockage',
      type: 'ordinateur',
      marque: 'HP',
      prix_unitaire_mad: 35000.00,
      fournisseur_id: hp.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Xeon E-2378', ram: '64 Go ECC DDR4', hdd: '10 To RAID-5' },
    },
    {
      nom: 'PC Laboratoire Informatique 01',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 8000.00,
      fournisseur_id: dell.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i5-12400', ram: '8 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'PC Laboratoire Informatique 02',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 8000.00,
      fournisseur_id: dell.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i5-12400', ram: '8 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'PC Laboratoire Informatique 03',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 8000.00,
      fournisseur_id: dell.id,
      etat: 'en_panne',
      specifications: { cpu: 'Intel Core i5-12400', ram: '8 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'PC Laboratoire Informatique 04',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 8000.00,
      fournisseur_id: dell.id,
      etat: 'disponible',
      specifications: { cpu: 'Intel Core i5-12400', ram: '8 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'PC Directeur Financier',
      type: 'ordinateur',
      marque: 'Lenovo',
      prix_unitaire_mad: 15800.00,
      fournisseur_id: len.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i7-1280P', ram: '32 Go DDR5', hdd: '1 To SSD' },
    },
    {
      nom: 'PC Directeur Technique',
      type: 'ordinateur',
      marque: 'HP',
      prix_unitaire_mad: 15800.00,
      fournisseur_id: hp.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i7-12700H', ram: '32 Go DDR5', hdd: '1 To SSD' },
    },
    {
      nom: 'PC Archivage Ancien Modèle 01',
      type: 'ordinateur',
      marque: 'Dell',
      prix_unitaire_mad: 4500.00,
      fournisseur_id: dell.id,
      etat: 'reforme',
      specifications: { cpu: 'Intel Core i3-8100', ram: '4 Go DDR4', hdd: '500 Go HDD' },
    },
    {
      nom: 'PC Archivage Ancien Modèle 02',
      type: 'ordinateur',
      marque: 'HP',
      prix_unitaire_mad: 4200.00,
      fournisseur_id: hp.id,
      etat: 'reforme',
      specifications: { cpu: 'Intel Core i3-7100', ram: '4 Go DDR3', hdd: '320 Go HDD' },
    },
    {
      nom: 'PC Logistique Entrepôt',
      type: 'ordinateur',
      marque: 'Acer',
      prix_unitaire_mad: 6500.00,
      fournisseur_id: acer.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i3-1215U', ram: '8 Go DDR4', hdd: '256 Go SSD' },
    },
    {
      nom: 'PC Bureau Marketing 01',
      type: 'ordinateur',
      marque: 'InfoTech',
      prix_unitaire_mad: 9500.00,
      fournisseur_id: info.id,
      etat: 'en_service',
      specifications: { cpu: 'Intel Core i5-12500', ram: '16 Go DDR4', hdd: '512 Go SSD' },
    },
    {
      nom: 'PC Bureau Marketing 02',
      type: 'ordinateur',
      marque: 'InfoTech',
      prix_unitaire_mad: 9500.00,
      fournisseur_id: info.id,
      etat: 'en_panne',
      specifications: { cpu: 'Intel Core i5-12500', ram: '16 Go DDR4', hdd: '512 Go SSD' },
    },
    // ——— Imprimantes ———
    {
      nom: 'Imprimante Direction A3 Couleur',
      type: 'imprimante',
      marque: 'Canon',
      prix_unitaire_mad: 14500.00,
      fournisseur_id: canon.id,
      etat: 'en_service',
      specifications: { vitesse_impression: '45 ppm', resolution: '2400x2400 dpi' },
    },
    {
      nom: 'Imprimante Open-Space RH',
      type: 'imprimante',
      marque: 'HP',
      prix_unitaire_mad: 6800.00,
      fournisseur_id: hp.id,
      etat: 'en_service',
      specifications: { vitesse_impression: '30 ppm', resolution: '1200x1200 dpi' },
    },
    {
      nom: 'Imprimante Comptabilité Laser',
      type: 'imprimante',
      marque: 'Brother',
      prix_unitaire_mad: 5200.00,
      fournisseur_id: bro.id,
      etat: 'en_service',
      specifications: { vitesse_impression: '40 ppm', resolution: '1200x1200 dpi' },
    },
    {
      nom: 'Imprimante Réception Tickets',
      type: 'imprimante',
      marque: 'Epson',
      prix_unitaire_mad: 3800.00,
      fournisseur_id: eps.id,
      etat: 'en_panne',
      specifications: { vitesse_impression: '20 ppm', resolution: '600x600 dpi' },
    },
    {
      nom: 'Imprimante Étiquettes Logistique',
      type: 'imprimante',
      marque: 'Epson',
      prix_unitaire_mad: 4200.00,
      fournisseur_id: eps.id,
      etat: 'en_service',
      specifications: { vitesse_impression: '15 ppm', resolution: '600x600 dpi' },
    },
    {
      nom: 'Imprimante Open-Space Marketing',
      type: 'imprimante',
      marque: 'Canon',
      prix_unitaire_mad: 8900.00,
      fournisseur_id: canon.id,
      etat: 'en_service',
      specifications: { vitesse_impression: '35 ppm', resolution: '1200x2400 dpi' },
    },
    {
      nom: 'Imprimante Salle de Réunion',
      type: 'imprimante',
      marque: 'HP',
      prix_unitaire_mad: 7200.00,
      fournisseur_id: hp.id,
      etat: 'disponible',
      specifications: { vitesse_impression: '28 ppm', resolution: '1200x1200 dpi' },
    },
    {
      nom: 'Imprimante Multifonction Direction',
      type: 'imprimante',
      marque: 'Canon',
      prix_unitaire_mad: 19500.00,
      fournisseur_id: canon.id,
      etat: 'en_service',
      specifications: { vitesse_impression: '60 ppm', resolution: '4800x2400 dpi' },
    },
    {
      nom: 'Imprimante Laser Archivage',
      type: 'imprimante',
      marque: 'Brother',
      prix_unitaire_mad: 4800.00,
      fournisseur_id: bro.id,
      etat: 'reforme',
      specifications: { vitesse_impression: '18 ppm', resolution: '600x600 dpi' },
    },
    {
      nom: 'Imprimante Thermique Caisse',
      type: 'imprimante',
      marque: 'Epson',
      prix_unitaire_mad: 2900.00,
      fournisseur_id: eps.id,
      etat: 'en_service',
      specifications: { vitesse_impression: '12 ppm', resolution: '300x300 dpi' },
    },
    {
      nom: 'Imprimante Réseau Laboratoire',
      type: 'imprimante',
      marque: 'HP',
      prix_unitaire_mad: 9800.00,
      fournisseur_id: hp.id,
      etat: 'en_panne',
      specifications: { vitesse_impression: '50 ppm', resolution: '1200x1200 dpi' },
    },
  ];
};

/* ============================================================
 * DONNÉES — Constats de Panne (35 entrées)
 * Règle : les imprimantes ne peuvent avoir que 'materielle'
 * ============================================================ */
const buildConstats = (ressources) => {
  const r = (nom) => ressources.find(res => res.nom.includes(nom));

  return [
    // — Pannes sur ordinateurs (nature libre)
    {
      ressource_id: r('Comptabilité 02').id,
      date_constat: '2026-01-08',
      nature_panne: 'materielle',
      description: 'Disque dur défaillant, bruits de cliquetis audibles au démarrage. SMART indique des secteurs défectueux.',
      frequence: 'permanente',
      urgence: 'critique',
    },
    {
      ressource_id: r('Comptabilité 02').id,
      date_constat: '2025-11-15',
      nature_panne: 'logicielle',
      description: 'Blue Screen of Death répétitifs avec erreur KERNEL_DATA_INPAGE_ERROR. Possible conflit de drivers.',
      frequence: 'frequente',
      urgence: 'haute',
    },
    {
      ressource_id: r('Commercial Terrain 03').id,
      date_constat: '2026-02-14',
      nature_panne: 'materielle',
      description: 'Batterie ne maintient plus la charge au-delà de 15 minutes. Gonflement visible du bloc batterie.',
      frequence: 'permanente',
      urgence: 'haute',
    },
    {
      ressource_id: r('Commercial Terrain 03').id,
      date_constat: '2025-12-01',
      nature_panne: 'logicielle',
      description: 'VPN d\'entreprise ne se connecte plus après mise à jour Windows 11 23H2. Erreur 789 L2TP.',
      frequence: 'premiere_fois',
      urgence: 'haute',
    },
    {
      ressource_id: r('Laboratoire Informatique 03').id,
      date_constat: '2026-03-05',
      nature_panne: 'materielle',
      description: 'Écran présente des lignes horizontales colorées. Câble DisplayPort ou carte graphique défaillant.',
      frequence: 'occasionnelle',
      urgence: 'moyenne',
    },
    {
      ressource_id: r('Laboratoire Informatique 03').id,
      date_constat: '2026-01-22',
      nature_panne: 'logicielle',
      description: 'Système d\'exploitation corrompu suite à une coupure de courant lors d\'une mise à jour. Impossible de démarrer.',
      frequence: 'premiere_fois',
      urgence: 'haute',
    },
    {
      ressource_id: r('Bureau Marketing 02').id,
      date_constat: '2026-04-10',
      nature_panne: 'logicielle',
      description: 'Suite Adobe Creative Cloud ne se lance plus. Erreur de licence après réinstallation du système.',
      frequence: 'premiere_fois',
      urgence: 'moyenne',
    },
    {
      ressource_id: r('Bureau Marketing 02').id,
      date_constat: '2026-03-28',
      nature_panne: 'materielle',
      description: 'Ventilateur processeur bruyant avec surchauffe. Température CPU dépasse 95°C en charge légère.',
      frequence: 'frequente',
      urgence: 'critique',
    },
    {
      ressource_id: r('Archivage Ancien Modèle 01').id,
      date_constat: '2025-10-05',
      nature_panne: 'materielle',
      description: 'Alimentation défaillante, l\'ordinateur s\'éteint aléatoirement. Capacitors gonflés visibles à l\'inspection.',
      frequence: 'frequente',
      urgence: 'basse',
    },
    {
      ressource_id: r('Archivage Ancien Modèle 02').id,
      date_constat: '2025-09-12',
      nature_panne: 'materielle',
      description: 'Disque dur HDD défaillant avec erreur de lecture. Clonage vers SSD recommandé avant remplacement.',
      frequence: 'permanente',
      urgence: 'basse',
    },
    {
      ressource_id: r('Salle de Conférence').id,
      date_constat: '2026-02-20',
      nature_panne: 'logicielle',
      description: 'Logiciel de présentation Teams ne se synchronise plus avec l\'écran de projection. Driver HDMI à réinstaller.',
      frequence: 'occasionnelle',
      urgence: 'moyenne',
    },
    {
      ressource_id: r('RH Recrutement').id,
      date_constat: '2026-04-15',
      nature_panne: 'logicielle',
      description: 'Antivirus Kaspersky bloque le logiciel SIRH en le signalant comme faux positif. Whitelist nécessaire.',
      frequence: 'premiere_fois',
      urgence: 'basse',
    },
    {
      ressource_id: r('Directeur Financier').id,
      date_constat: '2026-05-03',
      nature_panne: 'logicielle',
      description: 'Logiciel de comptabilité SAP plante au lancement avec erreur de certificat SSL expiré.',
      frequence: 'premiere_fois',
      urgence: 'critique',
    },
    {
      ressource_id: r('PC Logistique').id,
      date_constat: '2026-04-28',
      nature_panne: 'materielle',
      description: 'Clavier partiellement inopérant. Touches "A", "Z" et Entrée ne répondent plus. Usure mécanique.',
      frequence: 'premiere_fois',
      urgence: 'moyenne',
    },
    {
      ressource_id: r('Réception Accueil').id,
      date_constat: '2026-03-15',
      nature_panne: 'logicielle',
      description: 'Logiciel de gestion des visiteurs ne démarre plus après mise à jour système. Rollback nécessaire.',
      frequence: 'premiere_fois',
      urgence: 'haute',
    },
    // — Pannes sur imprimantes (materielle uniquement, règle métier)
    {
      ressource_id: r('Réception Tickets').id,
      date_constat: '2026-04-02',
      nature_panne: 'materielle',
      description: 'Bourrage papier permanent. Mécanisme d\'entraînement bloqué. Papier froissé à chaque impression.',
      frequence: 'permanente',
      urgence: 'critique',
    },
    {
      ressource_id: r('Réception Tickets').id,
      date_constat: '2025-12-18',
      nature_panne: 'materielle',
      description: 'Tête d\'impression encrassée. Lignes manquantes sur les tickets thermiques. Nettoyage approfondi requis.',
      frequence: 'occasionnelle',
      urgence: 'moyenne',
    },
    {
      ressource_id: r('Réseau Laboratoire').id,
      date_constat: '2026-05-01',
      nature_panne: 'materielle',
      description: 'Unité de fusion défectueuse. Impressions avec traînées noires et toner non fixé. Remplacement du kit four nécessaire.',
      frequence: 'premiere_fois',
      urgence: 'haute',
    },
    {
      ressource_id: r('Réseau Laboratoire').id,
      date_constat: '2026-02-09',
      nature_panne: 'materielle',
      description: 'Connectivité réseau intermittente. Interface RJ-45 physiquement endommagée. Carnet réseau à remplacer.',
      frequence: 'frequente',
      urgence: 'haute',
    },
    {
      ressource_id: r('Laser Archivage').id,
      date_constat: '2025-08-30',
      nature_panne: 'materielle',
      description: 'Tambour OPC usé. Impressions floues avec zones grises. Durée de vie dépassée (200k pages).',
      frequence: 'permanente',
      urgence: 'basse',
    },
    {
      ressource_id: r('Comptabilité Laser').id,
      date_constat: '2026-03-22',
      nature_panne: 'materielle',
      description: 'Alimentation papier bac 2 hors service. Ressort de rappel cassé. Utilisation forcée du bac manuel.',
      frequence: 'occasionnelle',
      urgence: 'basse',
    },
    {
      ressource_id: r('Open-Space RH').id,
      date_constat: '2026-04-19',
      nature_panne: 'materielle',
      description: 'Rouleaux de prise papier usés. Glissement fréquent causant des doubles alimentations et bourrages.',
      frequence: 'frequente',
      urgence: 'moyenne',
    },
    {
      ressource_id: r('Direction A3').id,
      date_constat: '2026-01-30',
      nature_panne: 'materielle',
      description: 'Cartouche toner cyan bloquée. Mécanisme de verrouillage défectueux. Impossible de retirer la cartouche.',
      frequence: 'premiere_fois',
      urgence: 'moyenne',
    },
    {
      ressource_id: r('Open-Space Marketing').id,
      date_constat: '2026-05-10',
      nature_panne: 'materielle',
      description: 'Scanner intégré ne détecte plus les documents. Capteur CCD défaillant. Résultats de numérisation tous noirs.',
      frequence: 'premiere_fois',
      urgence: 'haute',
    },
    // — Pannes supplémentaires sur ordinateurs
    {
      ressource_id: r('Workstation Design').id,
      date_constat: '2026-04-25',
      nature_panne: 'materielle',
      description: 'Carte graphique RTX 3090 affiche artefacts visuels en 3D. Overheating confirmé par GPU-Z (105°C).',
      frequence: 'occasionnelle',
      urgence: 'haute',
    },
    {
      ressource_id: r('Serveur NAS').id,
      date_constat: '2026-05-05',
      nature_panne: 'materielle',
      description: 'Disque n°3 du RAID-5 signalé en erreur. Risque de perte de données si un second disque tombe en panne.',
      frequence: 'premiere_fois',
      urgence: 'critique',
    },
    {
      ressource_id: r('Sécurité Surveillance').id,
      date_constat: '2026-04-08',
      nature_panne: 'logicielle',
      description: 'Logiciel de vidéosurveillance DVR plante quotidiennement. Perte des enregistrements nocturnes.',
      frequence: 'frequente',
      urgence: 'critique',
    },
    {
      ressource_id: r('Laboratoire Informatique 02').id,
      date_constat: '2026-02-28',
      nature_panne: 'logicielle',
      description: 'Licences MATLAB expirées. Étudiants impossibles de travailler sur les TPs de simulation numérique.',
      frequence: 'premiere_fois',
      urgence: 'haute',
    },
    {
      ressource_id: r('Directeur Technique').id,
      date_constat: '2026-03-12',
      nature_panne: 'logicielle',
      description: 'Environnement Docker Desktop corrompu après mise à jour WSL2. Conteneurs de développement inaccessibles.',
      frequence: 'premiere_fois',
      urgence: 'moyenne',
    },
    {
      ressource_id: r('Bureau Comptabilité 01').id,
      date_constat: '2025-11-28',
      nature_panne: 'logicielle',
      description: 'Microsoft Excel plante lors de l\'ouverture de fichiers .xlsx volumineux (>50 Mo). Corruption de profil Office.',
      frequence: 'occasionnelle',
      urgence: 'moyenne',
    },
    {
      ressource_id: r('Thermique Caisse').id,
      date_constat: '2026-05-08',
      nature_panne: 'materielle',
      description: 'Tête thermique dégradée. Impressions partielles avec moitié droite illisible. Remplacement de la tête requis.',
      frequence: 'premiere_fois',
      urgence: 'critique',
    },
    {
      ressource_id: r('Étiquettes Logistique').id,
      date_constat: '2026-04-14',
      nature_panne: 'materielle',
      description: 'Capteur de fin de papier hors service. L\'imprimante continue d\'imprimer à vide sans alerte de manque de papier.',
      frequence: 'occasionnelle',
      urgence: 'basse',
    },
    {
      ressource_id: r('Multifonction Direction').id,
      date_constat: '2026-05-12',
      nature_panne: 'materielle',
      description: 'Chargeur automatique de documents (ADF) bourré en permanence. Ressort de tension cassé nécessitant SAV Canon.',
      frequence: 'frequente',
      urgence: 'haute',
    },
    {
      ressource_id: r('Poste Direction').id,
      date_constat: '2026-04-30',
      nature_panne: 'logicielle',
      description: 'Mise à jour BIOS automatique a désactivé Secure Boot, empêchant le démarrage. Réinitialisation BIOS nécessaire.',
      frequence: 'premiere_fois',
      urgence: 'critique',
    },
    {
      ressource_id: r('PC Bureau Comptabilité 03').id,
      date_constat: '2026-05-14',
      nature_panne: 'materielle',
      description: 'Port USB-C de droite ne charge plus le laptop. Connecteur physiquement détérioré par usage intensif.',
      frequence: 'premiere_fois',
      urgence: 'basse',
    },
  ];
};

/* ============================================================
 * EXÉCUTION DU SEED
 * ============================================================ */
async function seed() {
  const bdd = BaseDeDonnees.obtenirInstance();

  console.log('🔌 Connexion à la base de données...');
  await bdd.testerConnexion();

  console.log('🗑️  Suppression et recréation des tables...');
  await bdd.synchroniser({ force: true });

  // 0. Utilisateurs
  console.log('👤 Insertion des utilisateurs...');
  const motDePasse = await bcrypt.hash('password123', 10);
  await Promise.all([
    Utilisateur.create({ nom: 'Administrateur Système', email: 'admin@grm.ma',       mot_de_passe_hash: motDePasse, role: 'admin' }),
    Utilisateur.create({ nom: 'Responsable Ressources', email: 'responsable@grm.ma', mot_de_passe_hash: motDePasse, role: 'responsable' }),
    Utilisateur.create({ nom: 'Technicien Support',     email: 'technicien@grm.ma',  mot_de_passe_hash: motDePasse, role: 'technicien' }),
    Utilisateur.create({ nom: 'Lecteur Consultant',     email: 'lecteur@grm.ma',     mot_de_passe_hash: motDePasse, role: 'lecteur' }),
  ]);
  console.log('   ✓ 4 utilisateurs insérés');

  // 1. Fournisseurs
  console.log('🏢 Insertion des fournisseurs...');
  const fournisseursInseres = await Promise.all(
    FOURNISSEURS.map(f => Fournisseur.create(f))
  );
  console.log(`   ✓ ${fournisseursInseres.length} fournisseurs insérés`);

  // 2. Ressources
  console.log('💻 Insertion des ressources...');
  const donneesRessources = buildRessources(fournisseursInseres);
  const ressourcesInserees = await Promise.all(
    donneesRessources.map(r => Ressource.create(r))
  );
  console.log(`   ✓ ${ressourcesInserees.length} ressources insérées`);

  // 3. Constats de panne
  console.log('⚠️  Insertion des constats de panne...');
  const donneesConstats = buildConstats(ressourcesInserees);
  const constatsInseres = await Promise.all(
    donneesConstats.map(c => ConstatDePanne.create(c))
  );
  console.log(`   ✓ ${constatsInseres.length} constats insérés`);

  // Résumé
  const enPanne = ressourcesInserees.filter(r => r.etat === 'en_panne').length;
  const listesNoires = fournisseursInseres.filter(f => f.statut === 'liste_noire').length;
  console.log('\n✅ Base de données peuplée avec succès !');
  console.log(`   👤 4 utilisateurs (admin / responsable / technicien / lecteur) — mot de passe : password123`);
  console.log(`   📦 ${fournisseursInseres.length} fournisseurs (${listesNoires} en liste noire)`);
  console.log(`   🖥️  ${ressourcesInserees.length} ressources (${enPanne} en panne)`);
  console.log(`   🔧 ${constatsInseres.length} constats de panne`);

  await bdd.obtenirSequelize().close();
}

seed().catch(err => {
  console.error('❌ Erreur lors du seed :', err.message);
  process.exit(1);
});
