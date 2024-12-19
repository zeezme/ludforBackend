import { AppError } from '../Middleware/ErrorHandler.js'
import Permission from '../../Permission/Models/PermissionModel.js'
import User from '../../User/Models/UserModel.js'
import Person from '../../Person/Models/PersonModel.js'
import { Op } from '@sequelize/core'

export interface IPermissionVerifyServiceAttributes {
  permission: string
  userId: string
}

class PermissionService {
  /**
   * Verifies if a user has a given permission.
   *
   * @throws {AppError} If the user is not found.
   * @throws {AppError} If there is an error in the database.
   * @throws {AppError} If the user does not have the given permission.
   */
  public async verify(
    attributes: IPermissionVerifyServiceAttributes
  ): Promise<void> {
    try {
      const user = await User.findOne({
        where: {
          id: attributes.userId
        },
        include: [
          {
            association: 'permissions',
            where: {
              description: attributes.permission
            },
            required: false
          },
          {
            association: 'persons',
            where: {
              type: 'admin'
            },
            required: false
          }
        ]
      })

      if (!user) {
        throw new AppError('User not found', 404)
      }

      const hasPermission = user.permissions?.some(
        permission => permission.description === attributes.permission
      )
      const isAdmin = user.persons?.some(person => person.type === 'admin')

      if (!(hasPermission || isAdmin)) {
        throw new AppError(
          `User does not have the required permission: ${attributes.permission}`,
          403
        )
      }
    } catch (error) {
      throw new AppError(`Error verifying permission: ${error}`, 500)
    }
  }
}

export default new PermissionService()
