const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

const JWT_SECRET = process.env.JWT_SECRET || 'grm_secret_dev_2026';
const JWT_EXPIRY = '24h';

exports.seConnecter = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) {
    return res.status(400).json({ succes: false, message: 'Email et mot de passe obligatoires.' });
  }
  try {
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(401).json({ succes: false, message: 'Identifiants invalides.' });
    }
    const valide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe_hash);
    if (!valide) {
      return res.status(401).json({ succes: false, message: 'Identifiants invalides.' });
    }
    const payload = { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    return res.json({ succes: true, token, utilisateur: payload });
  } catch (err) {
    return res.status(500).json({ succes: false, message: err.message });
  }
};

exports.obtenirProfil = (req, res) => {
  res.json({ succes: true, utilisateur: req.utilisateur });
};
