const { sequelize, connectDB } = require('../config/database');
const User = require('./User');
const Ward = require('./Ward');
const Issue = require('./Issue');
const Upvote = require('./Upvote');
const SafetyReport = require('./SafetyReport');
const SOSAlert = require('./SOSAlert');
const SafeLocation = require('./SafeLocation');

// ---- Associations ----

// Ward <-> Issue
Ward.hasMany(Issue, { foreignKey: 'ward_id', as: 'issues' });
Issue.belongsTo(Ward, { foreignKey: 'ward_id', as: 'ward' });

// User (reporter) <-> Issue
User.hasMany(Issue, { foreignKey: 'reporter_id', as: 'reportedIssues' });
Issue.belongsTo(User, { foreignKey: 'reporter_id', as: 'reporter' });

// User (assignee) <-> Issue
User.hasMany(Issue, { foreignKey: 'assigned_to', as: 'assignedIssues' });
Issue.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

// Issue <-> Upvote
Issue.hasMany(Upvote, { foreignKey: 'issue_id', as: 'upvotes' });
Upvote.belongsTo(Issue, { foreignKey: 'issue_id', as: 'issue' });

// User <-> Upvote
User.hasMany(Upvote, { foreignKey: 'user_id', as: 'upvotesGiven' });
Upvote.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> SafetyReport (optional, anonymous-friendly)
User.hasMany(SafetyReport, { foreignKey: 'reporter_id', as: 'safetyReports' });
SafetyReport.belongsTo(User, { foreignKey: 'reporter_id', as: 'reporter' });

// User <-> SOSAlert
User.hasMany(SOSAlert, { foreignKey: 'user_id', as: 'sosAlerts' });
SOSAlert.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

const db = {
  sequelize,
  connectDB,
  User,
  Ward,
  Issue,
  Upvote,
  SafetyReport,
  SOSAlert,
  SafeLocation,
};

module.exports = db;
