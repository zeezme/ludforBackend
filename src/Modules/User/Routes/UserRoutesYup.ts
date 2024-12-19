import * as Yup from 'yup'
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import { IDefaultRequest } from '../../../CoreTypes/Types/CoreRoutesTypes.js'

export class UserRoutesYup {
  public static signUp = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const paramSchema = Yup.object().shape({
      username: Yup.string().required('"username" is required.'),
      password: Yup.string()
        .required('"password" is required.')
        .min(6, '"password" must be at least 6 characters.')
        .max(20, '"password" must be at most 20 characters.')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
          '"password" must contain at least one lowercase letter, one uppercase letter, and one number.'
        ),
      email: Yup.string()
        .email('Invalid email format.')
        .required('"email" is required.')
    })

    try {
      await paramSchema.validate(request.body, { abortEarly: false })
      nextFunction()
    } catch (error: any) {
      throw new AppError(
        `Validation failed: ${error.errors ? error.errors.map((err: any) => err) : error}`,
        400
      )
    }
  }

  public static signIn = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const paramSchema = Yup.object().shape({
      username: Yup.string().required('"userame" is required.'),
      password: Yup.string().required('"password" is required.')
    })

    try {
      await paramSchema.validate(request.body, { abortEarly: false })
      nextFunction()
    } catch (error: any) {
      throw new AppError(
        `Validation failed: ${error.errors ? error.errors.map((err: any) => err) : error}`,
        400
      )
    }
  }

  public static update = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const paramSchema = Yup.object().shape({
      id: Yup.string()
        .uuid('Invalid "id" format.')
        .required('Person "id" is required.')
    })

    const schema = Yup.object().shape({
      email: Yup.string().email('Invalid "email" format.').optional(),
      personId: Yup.string().uuid('Invalid "personId" format.').optional()
    })

    try {
      await paramSchema.validate(request.params, { abortEarly: false })
      await schema.validate(request.body, { abortEarly: false })
      nextFunction()
    } catch (error: any) {
      throw new AppError(
        `Validation failed: ${error.errors ? error.errors.map((err: any) => err) : error}`,
        400
      )
    }
  }

  public static belongsToUser = async (
    request: IDefaultRequest,
    response: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const userId = request.userId

    if (!userId) {
      throw new Error('Error retrieving userId from default request')
    }

    if (request.params.id !== userId) {
      throw new AppError('Unauthorized', 401)
    }

    nextFunction()
  }
}
