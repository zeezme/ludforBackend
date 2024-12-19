import chalk from 'chalk'
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { IAppError } from '../../../CoreTypes/Types/CoreErrorTypes.js'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly status: string
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: IAppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  err.description = err.description || 'Internal Server Error'

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
    return
  }

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      name: err.name,
      message: err.message,
      description: err.description,
      statusCode: err.statusCode
    })
    return
  }

  // eslint-disable-next-line no-console
  console.error(chalk.bold.red(`\nERROR: ${err.message} `))
  res.status(500).json({
    status: 'error',
    message: err.message ?? 'Internal Server Error'
  })
}
