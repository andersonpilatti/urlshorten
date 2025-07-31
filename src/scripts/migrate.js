const { sequelize } = require('../config/database');

const migrate = async () => {
  try {
    console.log('🔄 Iniciando migração do banco de dados...');

    await sequelize.authenticate();
    console.log('✓ Conexão estabelecida');

    await sequelize.sync({ force: false, alter: true });
    console.log('✓ Tabelas criadas/atualizadas com sucesso');

    console.log('🎉 Migração concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
};

migrate();
