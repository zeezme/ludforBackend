import { IAppError } from '../Types/CoreErrorTypes.js'

export class AppError extends Error implements IAppError {
  public statusCode?: number
  public description: string
  public status?: string
  public isOperational?: boolean
  public stack?: string

  constructor({ message, statusCode, description }: IAppError) {
    super(message)
    this.statusCode = statusCode
    this.description = description || 'An error occurred'
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}
