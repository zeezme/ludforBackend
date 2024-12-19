import { Router } from 'express'

import UserController from '../Controller/UserController.js'
import { UserRoutesYup } from './UserRoutesYup.js'

const router = Router()

router.post('/signin', UserRoutesYup.signIn, UserController.signIn)

router.post('/signup', UserRoutesYup.signUp, UserController.signUp)

router.put(
  '/update',
  UserRoutesYup.belongsToUser,
  UserRoutesYup.update,
  UserController.update
)

export default router
