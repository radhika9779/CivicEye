const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Issue extends Model {}

Issue.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        'pothole',
        'streetlight',
        'garbage',
        'water_leak',
        'sewage',
        'other'
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'assigned', 'in_progress', 'resolved'),
      defaultValue: 'open',
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'low',
    },
    ai_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    ai_reasons: {
      type: DataTypes.JSON,
      defaultValue: [],
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
    photo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    upvote_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_anonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reporter_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ward_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    resolution_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Issue',
    tableName: 'issues',
  }
);

module.exports = Issue;
