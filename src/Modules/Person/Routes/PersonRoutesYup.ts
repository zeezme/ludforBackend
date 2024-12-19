import * as Yup from 'yup'
import { Request, Response, NextFunction } from 'express'
import PersonTypeEnum from '../../../CoreTypes/Enums/PersonTypeEnum.js'
import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import Person from '../Models/PersonModel.js'
import User from '../../User/Models/UserModel.js'
import { IDefaultRequest } from '../../../CoreTypes/Types/CoreRoutesTypes.js'

export class PersonRoutesYup {
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
        .required('Person ID is required.')
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
    const schema = Yup.object().shape({
      name: Yup.string().required('"name" is required.'),
      email: Yup.string()
        .email('Invalid "email" format.')
        .required('"email" is required.'),
      type: Yup.mixed()
        .oneOf(
          [PersonTypeEnum.USER, PersonTypeEnum.ADMIN],
          'Invalid person type.'
        )
        .required('Type is required.')
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
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

    const schema = Yup.object()
      .shape({
        name: Yup.string()
          .max(80, 'Name must be less than or equal to 80 characters.')
          .optional(),

        email: Yup.string()
          .email('Invalid "email" format.')
          .max(60, 'Email must be less than or equal to 60 characters.')
          .optional(),

        phone: Yup.string()
          .matches(/^\d{11}$/, 'Phone number must be 11 digits.')
          .optional(),

        active: Yup.boolean().optional(),

        extension: Yup.string()
          .max(10, 'Extension must be less than or equal to 10 characters.')
          .optional(),

        neighborhood: Yup.string()
          .max(
            120,
            'Neighborhood must be less than or equal to 120 characters.'
          )
          .optional(),

        complement: Yup.string()
          .max(120, 'Complement must be less than or equal to 120 characters.')
          .optional(),

        address: Yup.string()
          .max(80, 'Address must be less than or equal to 80 characters.')
          .optional(),

        number: Yup.string()
          .max(15, 'Number must be less than or equal to 15 characters.')
          .optional(),

        city: Yup.string()
          .max(80, 'City must be less than or equal to 80 characters.')
          .optional(),

        state: Yup.string()
          .max(40, 'State must be less than or equal to 40 characters.')
          .optional()
      })
      .noUnknown(
        true,
        'Property not allowed detected, please check your request.'
      )
      .strict(true)

    try {
      await paramSchema.validate(request.params, { abortEarly: false })

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

  public static delete = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ): Promise<void> => {
    const schema = Yup.object().shape({
      id: Yup.string()
        .uuid('Invalid "id" format.')
        .required('Person "id" is required.')
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

    if (!userId) {
      throw new Error('Error retrieving userId from default request')
    }

    const person = await Person.findByPk(request.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
          where: {
            id: userId
          },
          required: true
        }
      ]
    })

    if (!person) {
      throw new Error('Person does not belong to user')
    }

    nextFunction()
  }
}
