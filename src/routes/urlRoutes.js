const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  getUrlById,
  getUrlsByDate,
  redirectToOriginal,
  getOriginalUrl
} = require('../controllers/urlController');
const {
  validateUrl,
  validateId,
  validateDate,
  validateCode
} = require('../middleware/validation');

// Rotas da API
router.post('/api/shorten', validateUrl, shortenUrl);
router.get('/api/url/:id', validateId, getUrlById);
router.get('/api/urls/date/:date', validateDate, getUrlsByDate);
router.get('/api/code/:code', validateCode, getOriginalUrl);

// Rota de redirecionamento
router.get('/:code', validateCode, redirectToOriginal);

module.exports = router;
