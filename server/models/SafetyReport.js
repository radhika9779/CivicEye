const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class SafetyReport extends Model {}

SafetyReport.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    report_type: {
      type: DataTypes.ENUM('harassment', 'poor_lighting', 'unsafe_area', 'other'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    is_anonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    reporter_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'SafetyReport',
    tableName: 'safety_reports',
    updatedAt: false,
  }
);

module.exports = SafetyReport;
