import sequelize from '../../../../config/database.config.js'
import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import AuthenticationService from '../../Authentication/Services/AuthenticationService.js'
import Permission from '../../Permission/Models/PermissionModel.js'
import User from '../Models/UserModel.js'
import bcrypt from 'bcryptjs'

export interface UserSignUpServiceAttributesTypes {
  username: string
  password: string
  email: string
}

const defaultPermissions = [
  'employee_create',
  'employee_read',
  'employee_update',
  'employee_delete',
  'employee_menu',
  'person_create',
  'person_read',
  'person_update',
  'person_delete',
  'person_menu'
]

class UserSignUpService {
  public async run(
    attributes: UserSignUpServiceAttributesTypes
  ): Promise<string> {
    const transaction = await sequelize.startUnmanagedTransaction()
    try {
      let user = await User.findOne({
        where: {
          username: attributes.username
        },
        transaction
      })

      if (user) {
        throw new AppError('User already exists', 400)
      }

      user = await User.create(
        {
          username: attributes.username,
          password: await bcrypt.hash(attributes.password, 8),
          email: attributes.email
        },
        {
          include: [
            {
              model: Permission,
              as: 'permissions'
            }
          ],
          transaction
        }
      )

      if (!user) {
        throw new AppError('Error creating user', 500)
      }

      await user.addPermissionsByDescription(defaultPermissions, transaction)

      const token = await AuthenticationService.EmitToken({
        user,
        transaction
      })

      await AuthenticationService.ValidateToken(token)

      await transaction.commit()

      return 'User created successfully'
    } catch (error) {
      await transaction.rollback()
      throw new AppError(`Error creating user: ${error}`, 500)
    }
  }
}

export default new UserSignUpService()
