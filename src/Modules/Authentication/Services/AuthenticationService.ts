import jwt from 'jsonwebtoken'
import User from '../../User/Models/UserModel.js'
import Authentication from '../Models/AuthenticationModel.js'
import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import { IAuthenticationServiceTokenAttributes } from '../AuthenticationTypes.js'
import { Transaction } from '@sequelize/core'

export interface IAuthenticationServiceEmiteTokenAttributes {
  user: User
  transaction?: Transaction
}

class AuthenticationService {
  /**
   * Emits a JSON Web Token that can be used to authenticate a user.
   *
   * @param {IAuthenticationServiceEmiteTokenAttributes} props - The user to be authenticated.
   * @returns {Promise<string>} The JSON Web Token.
   *
   * @throws {Error} If the JWT_SECRET is not set.
   * @throws {Error} If the user is not found.
   */
  async EmitToken(
    props: IAuthenticationServiceEmiteTokenAttributes
  ): Promise<string> {
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      throw new Error('Missing JWT_SECRET, verify .env file')
    }

    const { user, transaction } = props

    if (!user || !user.id) {
      throw new Error('User not found')
    }

    const options = {
      expiresIn: '24h'
    }

    const payload = {
      userId: user.id,
      userName: user.username,
      userRole: user.person?.type || 'user'
    }

    const token = jwt.sign(payload, JWT_SECRET, options)

    await Authentication.upsert(
      {
        token,
        expiresAt: new Date(Date.now() + 3600 * 1000),
        userId: user.id
      },
      { transaction }
    )

    return token
  }

  /**
   * Validates a JSON Web Token by verifying its signature and extracting the payload.
   *
   * @param {string} token - The token to be validated.
   * @returns {Promise<any>} An object containing the userId, userName, exp, and iat if the token is valid; otherwise, null.
   *
   * @throws {Error} If the JWT_SECRET is not set.
   */
  async ValidateToken(token: string): Promise<any> {
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      throw new Error('Missing JWT_SECRET, verify .env file')
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      const { userId, userName, exp, iat } = decoded

      if (!userId || !userName) {
        throw new AppError('Token payload is missing required attributes', 400)
      }

      const user = await User.findOne({ where: { id: userId } })

      if (!user) {
        throw new AppError('User not found', 404)
      }

      return { userId, userName, exp, iat }
    } catch (error) {
      console.error('Token validation error:', error)
      return null
    }
  }
}

export default new AuthenticationService()
