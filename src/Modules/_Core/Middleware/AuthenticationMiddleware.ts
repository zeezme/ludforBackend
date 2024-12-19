import { IDefaultRequest } from '../../../CoreTypes/Types/CoreRoutesTypes.js'
import { NextFunction, Response } from 'express'
import { AppError } from './ErrorHandler.js'
import AuthenticationService from '../../Authentication/Services/AuthenticationService.js'

export const authenticationMiddleware = async (
  request: IDefaultRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const token = request.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return next(new Error('Missing authorization header'))
  }
  let validToken

  try {
    validToken = await AuthenticationService.ValidateToken(token)
  } catch (error) {
    return next(new AppError(`${error}`, 401))
  }

  if (!validToken) {
    return next(new AppError('Invalid token', 401))
  }

  request.userId = validToken.userId
  request.userName = validToken.userName

  next()
}
