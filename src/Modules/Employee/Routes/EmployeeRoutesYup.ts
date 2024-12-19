import * as Yup from 'yup'
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import Employee from '../Models/EmployeeModel.js'
import Person from '../../Person/Models/PersonModel.js'
import User from '../../User/Models/UserModel.js'
import { IDefaultRequest } from '../../../CoreTypes/Types/CoreRoutesTypes.js'

export class EmployeeRoutesYup {
  public static index = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const schema = Yup.object().shape({
      page: Yup.number().optional().min(1, 'Page must be greater than 0.'),
      pageSize: Yup.number()
        .optional()
        .min(1, 'PageSize must be greater than 0.')
        .max(100, 'PageSize must be less than 100.')
    })

    try {
      await schema.validate(request.query, { abortEarly: false })
      nextFunction()
    } catch (error: any) {
      throw new AppError(
        `Validation failed: ${error.errors ? error.errors.map((err: any) => err) : error}`,
        400
      )
    }
  }

  public static show = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const paramSchema = Yup.object().shape({
      id: Yup.string()
        .uuid('Invalid ID format.')
        .required('Employee ID is required.')
    })

    try {
      await paramSchema.validate(request.params, { abortEarly: false })
      nextFunction()
    } catch (error: any) {
      throw new AppError(
        `Validation failed: ${error.errors ? error.errors.map((err: any) => err) : error}`,
        400
      )
    }
  }

  public static store = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const schema = Yup.object()
      .shape({
        personId: Yup.string()
          .uuid('Invalid "personId" format.')
          .required('Employee "personId" is required.')
      })
      .noUnknown(
        true,
        'Property not allowed detected, please check your request.'
      )
      .strict(true)

    try {
      schema.validateSync(request.body, {
        abortEarly: false,
        strict: true,
        context: { noUnknown: true }
      })

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
        .required('Employee "id" is required.')
    })

    const schema = Yup.object().shape({
      personId: Yup.string()
        .uuid('Invalid "personId" format.')
        .required('Employee "personId" is required.')
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

  public static delete = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const schema = Yup.object().shape({
      id: Yup.string()
        .uuid('Invalid "id" format.')
        .required('Employee "id" is required.')
    })

    try {
      await schema.validate(request.params, { abortEarly: false })
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
    const personId = request.body.personId
    const paramId = request.params.id

    if (!userId) {
      throw new Error('Error retrieving userId from default request')
    }

    if (personId) {
      const person = await Person.findByPk(personId, {
        include: [
          {
            model: User,
            as: 'user',
            where: {
              id: userId
            },
            attributes: ['id', 'username'],
            required: true
          }
        ]
      })

      if (!person) {
        throw new Error('Person does not belong to user')
      }
    }

    if (paramId) {
      const employee = await Employee.findByPk(paramId, {
        include: [
          {
            model: Person,
            as: 'person',
            include: [
              {
                model: User,
                as: 'user',
                where: {
                  id: userId
                },
                attributes: ['id', 'username'],
                required: true
              }
            ],
            required: true
          }
        ]
      })

      if (!employee) {
        throw new Error('Employee does not belong to user')
      }
    }

    nextFunction()
  }
}
