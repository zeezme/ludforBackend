import dotenv from 'dotenv'
import express from 'express'
import defaultRoutes from './DefaultRoutes.js'
import { authenticationMiddleware } from '../Middleware/AuthenticationMiddleware.js'
import userRoutes from '../../User/Routes/UserRoutes.js'
import authenticationRouter from '../../Authentication/Routes/AuthenticationRoutes.js'

dotenv.configDotenv()

const router = express.Router()

// #region Unprotected routes

router.use(authenticationRouter)
router.use(userRoutes)

// #endregion Unprotected routes

// #region Protected routes

router.use(authenticationMiddleware)
router.use(defaultRoutes)

// #endregion Protected routes

export default router
