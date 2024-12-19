import Sequelize from '@sequelize/core'
import { PostgresDialect } from '@sequelize/postgres'
import dotenv from 'dotenv'

import { models } from './models.js'

dotenv.config()

const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const dbHost = process.env.DB_HOST
const dbPort = Number(process.env.DB_PORT) || 5432

if (!dbName || !dbUser || !dbPass || !dbHost || !dbPort) {
  throw new Error('Missing database configuration')
}

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: dbName,
  user: dbUser,
  password: dbPass,
  host: dbHost,
  port: dbPort,
  clientMinMessages: 'notice',
  models
})

export default sequelize
