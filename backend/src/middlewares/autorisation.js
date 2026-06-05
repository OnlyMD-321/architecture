module.exports = function autoriser(...roles) {
  return (req, res, next) => {
    if (!req.utilisateur) {
      return res.status(401).json({ succes: false, message: 'Non authentifié.' });
    }
    if (!roles.includes(req.utilisateur.role)) {
      return res.status(403).json({
        succes: false,
        message: `Accès refusé. Rôle requis : ${roles.join(' ou ')}. Votre rôle : ${req.utilisateur.role}.`,
      });
    }
    next();
  };
};
