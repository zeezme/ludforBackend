import { Router } from 'express'

import AuthenticationController from '../Controller/AuthenticationController.js'

const router = Router()

router.post('/verify-token', AuthenticationController.verifyToken)

export default router
