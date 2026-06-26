const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class SOSAlert extends Model {}

SOSAlert.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
    status: {
      type: DataTypes.ENUM('active', 'resolved'),
      defaultValue: 'active',
    },
    triggered_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'SOSAlert',
    tableName: 'sos_alerts',
    updatedAt: false,
  }
);

module.exports = SOSAlert;
