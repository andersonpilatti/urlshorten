const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'API para encurtamento de URLs desenvolvida com Node.js, Express e PostgreSQL',
      contact: {
        name: 'Andy',
        email: 'andy@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    tags: [
      {
        name: 'URLs',
        description: 'Operações relacionadas ao encurtamento de URLs'
      },
      {
        name: 'Health',
        description: 'Verificação de saúde da API'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJSDoc(options);
module.exports = specs;
