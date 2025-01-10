import sequelize from '../../../../config/database.config.js'
import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import Authentication from '../../Authentication/Models/AuthenticationModel.js'
import AuthenticationService from '../../Authentication/Services/AuthenticationService.js'
import Permission from '../../Permission/Models/PermissionModel.js'
import User from '../Models/UserModel.js'
import bcrypt from 'bcryptjs'

export interface UserSignInServiceAttributesTypes {
  username: string
  password: string
}

class UserSignInService {
  /**
   * Service to sign in a user, given its username and password. If the credentials are valid, the method returns a JWT token.
   * If the token is already stored in the database, it is returned. If it is invalid, a new one is generated and stored.
   * If there is no token in the database, one is generated and stored.
   *
   * @throws {AppError} if the username or password are invalid
   * @throws {AppError} if there is a problem emitting the token
   * @returns {Promise<string>} the JWT token
   */
  public async run(
    attributes: UserSignInServiceAttributesTypes
  ): Promise<{ token: string; permissions: string[]; username: string }> {
    const transaction = await sequelize.startUnmanagedTransaction()

    try {
      const user = await User.findOne({
        where: {
          username: attributes.username
        },
        transaction
      })

      if (!user) {
        throw new AppError('Invalid username or password', 401)
      }

      const isPasswordValid = await bcrypt.compare(
        attributes.password,
        user.password
      )

      if (!isPasswordValid) {
        throw new AppError('Invalid username or password', 401)
      }

      const authentication = await Authentication.findOne({
        where: {
          userId: user.id
        },
        order: [['createdAt', 'DESC']],
        transaction
      })

      const token = await AuthenticationService.ValidateEnsureToken({
        user,
        token: authentication?.token,
        transaction
      })

      if (!token) {
        throw new AppError('Problem emitting token', 500)
      }

      const permissionsList = await Permission.findAll({
        include: {
          model: User,
          as: 'users',
          where: {
            id: user.id
          },
          attributes: []
        },
        attributes: ['description'],
        transaction
      })

      transaction.commit()

      return {
        username: user.username,
        token,
        permissions: permissionsList.map(permission => permission.description)
      }
    } catch (error) {
      await transaction.rollback()
      throw new AppError(`Error creating user: ${error}`, 500)
    }
  }
}

export default new UserSignInService()
