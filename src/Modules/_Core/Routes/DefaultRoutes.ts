import PersonRouter from '../../Person/Routes/PersonRoutes.js'

import UserRouter from '../../User/Routes/UserRoutes.js'

import EmployeeRouter from '../../Employee/Routes/EmployeeRoutes.js'

import { Router } from 'express'

const defaultRoutes = Router()

export default defaultRoutes

defaultRoutes.use('/user', UserRouter)

defaultRoutes.use('/person', PersonRouter)

defaultRoutes.use('/employee', EmployeeRouter)
