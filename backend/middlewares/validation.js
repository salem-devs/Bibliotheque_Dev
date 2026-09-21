const validerAdherent = (req, res, next) => {
  const { nom, contact } = req.body;

  if (!nom || !contact) {
    return res.status(400).json({
      message: 'Le nom et le contact sont obligatoires'
    });
  }

  next();
};

module.exports = {
  validerAdherent
};