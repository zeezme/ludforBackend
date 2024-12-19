import Person from '../src/Modules/Person/Models/PersonModel.js'

import Permission from '../src/Modules/Permission/Models/PermissionModel.js'

import User from '../src/Modules/User/Models/UserModel.js'

import Log from '../src/Modules/_Core/Audit/Model/Log.js'

import Authentication from '../src/Modules/Authentication/Models/AuthenticationModel.js'

import Employee from '../src/Modules/Employee/Models/EmployeeModel.js'
import UserPermission from '../src/Modules/UserPermission/Models/UsersPermissions.js'

export const models = [
  Log,
  User,
  Permission,
  Person,
  Authentication,
  Employee,
  UserPermission
]
