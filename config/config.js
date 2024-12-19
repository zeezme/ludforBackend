import dotenv from 'dotenv'
dotenv.config()

export default {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'database_development',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeedersMeta'
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST || 'database_test',
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeedersMeta'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeedersMeta'
  }
}
