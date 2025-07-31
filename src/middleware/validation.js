const { body, param } = require('express-validator');

const validateUrl = [
  body('originalUrl')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('URL deve ser válida e conter protocolo http ou https')
    .isLength({ max: 2048 })
    .withMessage('URL não pode exceder 2048 caracteres')
];

const validateId = [
  param('id')
    .isUUID()
    .withMessage('ID deve ser um UUID válido')
];

const validateDate = [
  param('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Data deve estar no formato YYYY-MM-DD')
    .isISO8601()
    .withMessage('Data deve ser válida')
];

const validateCode = [
  param('code')
    .isLength({ min: 1, max: 20 })
    .withMessage('Código deve ter entre 1 e 20 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Código deve conter apenas letras, números, hífens e underscores')
];

module.exports = {
  validateUrl,
  validateId,
  validateDate,
  validateCode
};
