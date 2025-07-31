const shortid = require('shortid');
const moment = require('moment');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Url = require('../models/Url');

// Encurtar URL
const shortenUrl = async (req, res) => {
  try {
    // Verificar validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { originalUrl } = req.body;

    // Verificar se a URL já existe
    const existingUrl = await Url.findOne({
      where: { originalUrl }
    });

    if (existingUrl) {
      return res.status(200).json({
        success: true,
        message: 'URL já existe',
        data: existingUrl
      });
    }

    // Gerar código único
    let urlCode;
    let isUnique = false;

    while (!isUnique) {
      urlCode = shortid.generate();
      const existing = await Url.findOne({ where: { urlCode } });
      if (!existing) {
        isUnique = true;
      }
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${urlCode}`;

    // Criar nova URL encurtada
    const newUrl = await Url.create({
      originalUrl,
      urlCode,
      shortUrl
    });

    res.status(201).json({
      success: true,
      message: 'URL encurtada com sucesso',
      data: newUrl
    });

  } catch (error) {
    console.error('Erro ao encurtar URL:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Buscar URL por ID
const getUrlById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    const url = await Url.findByPk(id);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'URL encontrada',
      data: url
    });

  } catch (error) {
    console.error('Erro ao buscar URL:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Buscar URLs por data
const getUrlsByDate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Data inválida',
        errors: errors.array()
      });
    }

    const { date } = req.params;

    // Definir início e fim do dia
    const startDate = moment(date).startOf('day').toDate();
    const endDate = moment(date).endOf('day').toDate();

    const urls = await Url.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: `URLs encontradas para ${date}`,
      count: urls.length,
      data: urls
    });

  } catch (error) {
    console.error('Erro ao buscar URLs por data:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Redirecionar para URL original
const redirectToOriginal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido',
        errors: errors.array()
      });
    }

    const { code } = req.params;

    const url = await Url.findOne({
      where: { urlCode: code }
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL não encontrada'
      });
    }

    // Incrementar contador de cliques
    await url.increment('clicks');

    // Redirecionar
    res.redirect(301, url.originalUrl);

  } catch (error) {
    console.error('Erro ao redirecionar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Buscar URL original pelo código
const getOriginalUrl = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido',
        errors: errors.array()
      });
    }

    const { code } = req.params;

    const url = await Url.findOne({
      where: { urlCode: code }
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'URL encontrada',
      data: url
    });

  } catch (error) {
    console.error('Erro ao buscar URL:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  shortenUrl,
  getUrlById,
  getUrlsByDate,
  redirectToOriginal,
  getOriginalUrl
};
