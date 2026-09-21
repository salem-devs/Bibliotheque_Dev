const express = require('express');

const {
  getAdherents,
  createAdherent,
  updateAdherent,
  deleteAdherent
} = require('../controllers/adherentController');
const { validerAdherent } = require('../middlewares/validation');


const router = express.Router();

router.get('/', getAdherents);
router.post('/', createAdherent);
router.put('/:id', updateAdherent);
router.delete('/:id', deleteAdherent);
router.post('/', validerAdherent, createAdherent);

module.exports = router;