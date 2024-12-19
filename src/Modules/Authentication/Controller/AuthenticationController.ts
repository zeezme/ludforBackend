import { Response } from 'express'
import { IDefaultRequest } from '../../../CoreTypes/Types/CoreRoutesTypes.js'
import jwt from 'jsonwebtoken'

class AuthenticationController {
  public async verifyToken(
    request: IDefaultRequest,
    response: Response
  ): Promise<any> {
    try {
      const { token } = request.body

      const JWT_SECRET = process.env.JWT_SECRET

      if (!JWT_SECRET) {
        throw new Error('Missing JWT_SECRET, verify .env file')
      }

      jwt.verify(token, JWT_SECRET)

      return response.send(true)
    } catch {
      return response.status(401).send(false)
    }
  }
}

export default new AuthenticationController()
