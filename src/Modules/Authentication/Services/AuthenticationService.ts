import jwt from 'jsonwebtoken'
import User from '../../User/Models/UserModel.js'
import Authentication from '../Models/AuthenticationModel.js'
import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import { Transaction } from '@sequelize/core'

export interface IAuthenticationServiceEmitTokenAttributes {
  user: User
  transaction?: Transaction
}
export interface IAuthenticationServiceVerifyTokenAttributes {
  token: string
  transaction?: Transaction
}

export interface IAuthenticationServiceVerifyEnsureTokenAttributes {
  user?: User
  token?: string
  transaction?: Transaction
}

class AuthenticationService {
  /**
   * Emits a JSON Web Token that can be used to authenticate a user.
   *
   * @param {IAuthenticationServiceEmitTokenAttributes} props - The user to be authenticated.
   * @returns {Promise<string>} The JSON Web Token.
   *
   * @throws {Error} If the JWT_SECRET is not set.
   * @throws {Error} If the user is not found.
   */
  async EmitToken(
    props: IAuthenticationServiceEmitTokenAttributes
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

    try {
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
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Validates a JSON Web Token by verifying its signature and extracting the payload.
   *
   * @param {string} token - The token to be validated.
   * @returns {Promise<any>} An object containing the userId, userName, exp, and iat if the token is valid; otherwise, null.
   *
   * @throws {Error} If the JWT_SECRET is not set.
   */
  async ValidateToken(
    props: IAuthenticationServiceVerifyTokenAttributes
  ): Promise<any> {
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      throw new Error('Missing JWT_SECRET, verify .env file')
    }

    try {
      const decoded = jwt.verify(props.token, JWT_SECRET) as any

      const { userId, userName, exp, iat } = decoded

      if (!userId || !userName) {
        throw new AppError('Token payload is missing required attributes', 400)
      }

      const user = await User.findOne({
        where: { id: userId },
        transaction: props.transaction
      })

      if (!user) {
        throw new AppError('User not found', 404)
      }

      return { userId, userName, exp, iat }
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401)
      } else if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', 401)
      } else {
        throw new AppError('Token validation failed', 500)
      }
    }
  }

  /**
   * Validates a JSON Web Token by verifying its signature and extracting the payload.
   * If the token is invalid or expired, reissues a new token for the same user.
   *
   * @param {IAuthenticationServiceVerifyTokenAttributes} props - An object containing the token and transaction.
   * @returns {Promise<string>} The valid token.
   *
   * @throws {Error} If the JWT_SECRET is not set.
   * @throws {AppError} If the token payload is invalid or the user is not found.
   */
  async ValidateEnsureToken(
    props: IAuthenticationServiceVerifyEnsureTokenAttributes
  ): Promise<string> {
    const { token, transaction, user } = props

    if (!token) {
      if (!user) {
        throw new AppError('User must be provided.', 400)
      }
      const newToken = await this.EmitToken({ user, transaction })

      return newToken
    }

    try {
      await this.ValidateToken({ token, transaction })

      return token
    } catch {
      const JWT_SECRET = process.env.JWT_SECRET

      if (!JWT_SECRET) {
        throw new Error('Missing JWT_SECRET, verify .env file')
      }

      try {
        const decoded = jwt.decode(token) as any

        if (!decoded || !decoded.userId) {
          throw new AppError(
            'Invalid token payload. Cannot reissue token.',
            400
          )
        }

        const user = await User.findOne({
          where: { id: decoded.userId },
          transaction
        })

        if (!user) {
          throw new AppError('User not found for token reissue.', 404)
        }

        return this.EmitToken({ user, transaction })
      } catch (error) {
        throw new AppError(`Failed to decode token payload. ${error}`, 400)
      }
    }
  }
}

export default new AuthenticationService()
