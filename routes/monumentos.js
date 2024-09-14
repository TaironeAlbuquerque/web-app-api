const express = require('express');
const router = express.Router();
const monumentosController = require('../controllers/monumentosController');

router.get('/', monumentosController.getAllMonumentos);
router.post('/', monumentosController.createMonumento);
router.put('/:id', monumentosController.updateMonumento);
router.delete('/:id', monumentosController.deleteMonumento);

module.exports = router;
