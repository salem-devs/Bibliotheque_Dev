const express = require('express');

const {
  getEmprunts,
  createEmprunt,
  retournerEmprunt,
  getEmpruntsEnCours,
  getEmpruntsEnRetard,
  getHistoriqueAdherent
} = require('../controllers/empruntController');

const router = express.Router();

router.get('/', getEmprunts);
router.post('/', createEmprunt);

router.get('/en-cours', getEmpruntsEnCours);
router.get('/en-retard', getEmpruntsEnRetard);
router.get('/adherent/:adherentId/historique', getHistoriqueAdherent);

router.put('/:id/retour', retournerEmprunt);

module.exports = router;