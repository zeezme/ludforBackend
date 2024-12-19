/* eslint-disable no-console */
import 'express-async-errors'
import 'reflect-metadata'

import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import cors from 'cors'

import sequelize from '../config/database.config.js'
import showLogo from '../Scripts/ShowLogo.js'
import router from './Modules/_Core/Routes/Routes.js'

import { errorHandler } from './Modules/_Core/Middleware/ErrorHandler.js'

const isDebugMode = process.env.NODE_ENV === 'development'

if (isDebugMode) {
  showLogo.run()
}

const __dirname = process.cwd()

sequelize
  .authenticate()
  .then(() => {
    console.log('Banco Conectado!')
  })
  .catch(error => {
    console.error('Erro no Banco', error)
  })

const app = express()

dotenv.config()

// Configuração do CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://piranha-proven-merely.ngrok-free.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(router)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
