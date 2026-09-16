const express = require('express');

const {
  getAuteurs,
  createAuteur,
  updateAuteur,
  deleteAuteur
} = require('../controllers/auteurController');

const router = express.Router();

router.get('/', getAuteurs);
router.post('/', createAuteur);
router.put('/:id', updateAuteur);
router.delete('/:id', deleteAuteur);

module.exports = router;