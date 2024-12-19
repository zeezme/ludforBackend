export interface IAppError extends Error {
  statusCode?: number
  description: string
  status?: string
  isOperational?: boolean
  stack?: string
}
