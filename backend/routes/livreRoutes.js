const express = require('express');

const {
  getLivres,
  createLivre,
  updateLivre,
  deleteLivre
} = require('../controllers/livreController');

const { validerLivre } = require('../middlewares/validation');

const router = express.Router();

router.get('/', getLivres);
router.post('/', validerLivre, createLivre);
router.put('/:id', updateLivre);
router.delete('/:id', deleteLivre);


module.exports = router;