const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Url = sequelize.define('Url', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  originalUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  urlCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    index: true
  },
  shortUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'urls',
  timestamps: true,
  indexes: [
    {
      fields: ['urlCode']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Url;
