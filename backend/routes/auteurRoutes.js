const express = require('express');

const {
  getAuteurs,
  createAuteur,
  updateAuteur,
  deleteAuteur
} = require('../controllers/auteurController');
const { validerAuteur } = require('../middlewares/validation');

const router = express.Router();

router.get('/', getAuteurs);
router.post('/', validerAuteur, createAuteur);
router.put('/:id', validerAuteur, updateAuteur);
router.delete('/:id', deleteAuteur);

module.exports = router;