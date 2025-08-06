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

/**
 * @swagger
 * components:
 *   schemas:
 *     URL:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da URL
 *         originalUrl:
 *           type: string
 *           format: uri
 *           description: URL original a ser encurtada
 *         shortUrl:
 *           type: string
 *           format: uri
 *           description: URL encurtada
 *         urlCode:
 *           type: string
 *           description: Código único da URL encurtada
 *         clicks:
 *           type: integer
 *           description: Número de cliques na URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *     ShortenRequest:
 *       type: object
 *       required:
 *         - originalUrl
 *       properties:
 *         originalUrl:
 *           type: string
 *           format: uri
 *           description: URL a ser encurtada
 *           example: "https://www.google.com"
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *     HealthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "API funcionando corretamente"
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Encurtar uma URL
 *     description: Cria uma versão encurtada de uma URL longa
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShortenRequest'
 *     responses:
 *       201:
 *         description: URL encurtada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/URL'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/url/{id}:
 *   get:
 *     summary: Buscar URL por ID
 *     description: Retorna os dados de uma URL específica usando seu ID único
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da URL (UUID)
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: URL encontrada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/URL'
 *       404:
 *         description: URL não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/urls/date/{date}:
 *   get:
 *     summary: Listar URLs por data
 *     description: Retorna todas as URLs encurtadas em uma data específica
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data no formato YYYY-MM-DD
 *         example: "2025-08-05"
 *     responses:
 *       200:
 *         description: URLs encontradas para a data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: Número de URLs encontradas
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/URL'
 *       400:
 *         description: Data inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/code/{code}:
 *   get:
 *     summary: Buscar URL por código
 *     description: Retorna os dados de uma URL usando o código encurtado
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código único da URL encurtada
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: URL encontrada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/URL'
 *       404:
 *         description: URL não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /{code}:
 *   get:
 *     summary: Redirecionar para URL original
 *     description: Redireciona automaticamente para a URL original e incrementa o contador de cliques
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código da URL encurtada
 *         example: "abc123"
 *     responses:
 *       301:
 *         description: Redirecionamento permanente para URL original
 *         headers:
 *           Location:
 *             description: URL original
 *             schema:
 *               type: string
 *               format: uri
 *       404:
 *         description: URL não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "URL não encontrada"
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar saúde da API
 *     description: Endpoint para verificar se a API está funcionando corretamente
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */

// Rotas da API
router.post('/api/shorten', validateUrl, shortenUrl);
router.get('/api/url/:id', validateId, getUrlById);
router.get('/api/urls/date/:date', validateDate, getUrlsByDate);
router.get('/api/code/:code', validateCode, getOriginalUrl);

// Rota de redirecionamento
router.get('/:code', validateCode, redirectToOriginal);

module.exports = router;
