const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexão com PostgreSQL estabelecida com sucesso');

    // Sincronizar modelos com o banco
    await sequelize.sync({ force: false });
    console.log('✓ Tabelas sincronizadas');
  } catch (error) {
    console.error('✗ Erro ao conectar com o banco:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
