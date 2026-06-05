const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'grm_secret_dev_2026';

module.exports = function authentifier(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ succes: false, message: 'Authentification requise.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.utilisateur = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ succes: false, message: 'Token expiré ou invalide.' });
  }
};
