import { Router } from 'express'

import EmployeeController from '../Controller/EmployeeController.js'
import { EmployeeRoutesYup } from './EmployeeRoutesYup.js'

const router = Router()

router.get('/', EmployeeRoutesYup.index, EmployeeController.index)

router.get('/:id', EmployeeRoutesYup.show, EmployeeController.show)

router.post(
  '/',
  EmployeeRoutesYup.belongsToUser,
  EmployeeRoutesYup.store,
  EmployeeController.store
)

router.put(
  '/:id',
  EmployeeRoutesYup.belongsToUser,
  EmployeeRoutesYup.update,
  EmployeeController.update
)

router.delete(
  '/:id',
  EmployeeRoutesYup.belongsToUser,
  EmployeeRoutesYup.delete,
  EmployeeController.delete
)

export default router
