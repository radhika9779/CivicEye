const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Upvote extends Model {}

Upvote.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    issue_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Upvote',
    tableName: 'upvotes',
    indexes: [
      {
        unique: true,
        fields: ['issue_id', 'user_id'],
      },
    ],
  }
);

module.exports = Upvote;
