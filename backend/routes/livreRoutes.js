const express = require('express');

const {
  getLivres,
  createLivre,
  updateLivre,
  deleteLivre
} = require('../controllers/livreController');

const router = express.Router();

router.get('/', getLivres);
router.post('/', createLivre);
router.put('/:id', updateLivre);
router.delete('/:id', deleteLivre);

module.exports = router;