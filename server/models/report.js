'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      Report.belongsTo(models.User, { foreignKey: 'userId', as: 'pelapor' });
    }
  }
  Report.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    photo: DataTypes.STRING,
    latitude: DataTypes.DECIMAL(10, 8),
    longitude: DataTypes.DECIMAL(11, 8),
    status: { 
      type: DataTypes.ENUM('Pending', 'Proses', 'Selesai'), 
      defaultValue: 'Pending' 
    }
  }, { sequelize, modelName: 'Report' });
  return Report;
};