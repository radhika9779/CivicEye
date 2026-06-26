const { Sequelize } = require('sequelize');
require('dotenv').config();

const sharedDefine = {
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

let sequelize;

if (process.env.DATABASE_URL) {
  // Cloud Postgres (Neon, Supabase, Railway, etc.) — single connection string.
  // Managed providers use SSL with certs that aren't in Node's default trust
  // store, so rejectUnauthorized:false is the standard way to allow that
  // (the connection itself is still encrypted, just not cert-pinned).
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: sharedDefine,
  });
} else {
  // Local Postgres — separate host/user/password params.
  sequelize = new Sequelize(
    process.env.DB_NAME || 'civiceye',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      define: sharedDefine,
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

