import { Request, Response } from 'express'
import UserSignUpService from '../Services/UserSignUpService.js'
import UserUpdateService from '../Services/UserUpdateService.js'
import { IDefaultRequest } from '../../../CoreTypes/Types/CoreRoutesTypes.js'
import userSignInService from '../Services/UserSignInService.js'

class UserController {
  public async signUp(request: Request, response: Response): Promise<void> {
    const signUpResponse = await UserSignUpService.run({
      email: request.body.email,
      username: request.body.username,
      password: request.body.password
    })

    response.send(signUpResponse)
  }

  public async signIn(request: Request, response: Response): Promise<void> {
    const signInResponse = await userSignInService.run({
      username: request.body.username,
      password: request.body.password
    })

    response.send(signInResponse)
  }

  public async update(
    request: IDefaultRequest,
    response: Response
  ): Promise<void> {
    const { id } = request.params
    const { email, personId } = request.body

    const updateResponse = await UserUpdateService.run({
      id,
      data: {
        email,
        personId
      },
      userId: request.userId
    })

    response.send(updateResponse)
  }
}

export default new UserController()
