const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Ward extends Model {}

Ward.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat_min: { type: DataTypes.FLOAT, allowNull: false },
    lat_max: { type: DataTypes.FLOAT, allowNull: false },
    lon_min: { type: DataTypes.FLOAT, allowNull: false },
    lon_max: { type: DataTypes.FLOAT, allowNull: false },
    officer_name: { type: DataTypes.STRING },
    officer_email: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: 'Ward',
    tableName: 'wards',
  }
);

module.exports = Ward;
