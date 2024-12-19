import { Router } from 'express'

import PersonController from '../Controller/PersonController.js'
import { PersonRoutesYup } from './PersonRoutesYup.js'

const router = Router()

router.get('/', PersonRoutesYup.index, PersonController.index)

router.get('/:id', PersonRoutesYup.show, PersonController.show)

router.post('/', PersonRoutesYup.store, PersonController.store)

router.put(
  '/:id',
  PersonRoutesYup.belongsToUser,
  PersonRoutesYup.update,
  PersonController.update
)

router.delete(
  '/:id',
  PersonRoutesYup.belongsToUser,
  PersonRoutesYup.delete,
  PersonController.delete
)

export default router
