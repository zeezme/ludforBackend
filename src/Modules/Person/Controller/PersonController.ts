import { Response } from 'express'
import { IDefaultRequest } from '../../../CoreTypes/Types/CoreRoutesTypes.js'
import PersonStoreService from '../Services/PersonStoreService.js'
import PersonUpdateService from '../Services/PersonUpdateService.js'
import PersonDeleteService from '../Services/PersonDeleteService.js'
import Person from '../Models/PersonModel.js'
import User from '../../User/Models/UserModel.js'
import PermissionService from '../../_Core/Services/PermissionService.js'

class PersonController {
  public async index(
    request: IDefaultRequest,
    response: Response
  ): Promise<void> {
    const userId = request.userId

    if (!userId) {
      throw new Error('User not present on default request')
    }

    await PermissionService.verify({
      userId,
      permission: 'person_read'
    })

    const page = Number(request.query.page) || 1
    const pageSize = Number(request.query.pageSize) || 10
    const offset = (page - 1) * pageSize

    const { count, rows: personList } = await Person.findAndCountAll({
      where: {
        userId
      },
      offset,
      limit: pageSize
    })

    response.json({
      data: personList,
      meta: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    })
  }

  public async show(
    request: IDefaultRequest,
    response: Response
  ): Promise<void> {
    const { id } = request.params
    const userId = request.userId

    if (!userId) {
      throw new Error('User not present on default request')
    }

    await PermissionService.verify({
      userId,
      permission: 'person_read'
    })

    const person = await Person.findByPk(id, {
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
      throw new Error('Person not found')
    }

    response.send(person)
  }

  public async store(
    request: IDefaultRequest,
    response: Response
  ): Promise<void> {
    const { name, email, type } = request.body
    const userId = request.userId

    if (!userId) {
      throw new Error('User not present on default request')
    }

    await PermissionService.verify({
      userId,
      permission: 'person_create'
    })

    const creationResponse = await PersonStoreService.run({
      data: {
        name,
        email,
        type
      },
      userId
    })

    response.send(creationResponse)
  }

  public async update(
    request: IDefaultRequest,
    response: Response
  ): Promise<void> {
    const { id } = request.params
    const userId = request.userId

    if (!userId) {
      throw new Error('User not present on default request')
    }

    await PermissionService.verify({
      userId,
      permission: 'person_update'
    })

    const updateResponse = await PersonUpdateService.run({
      id,
      data: request.body,
      userId
    })

    response.send(updateResponse)
  }

  public async delete(
    request: IDefaultRequest,
    response: Response
  ): Promise<void> {
    const { id } = request.params
    const userId = request.userId

    if (!userId) {
      throw new Error('User not present on default request')
    }

    await PermissionService.verify({
      userId,
      permission: 'person_delete'
    })

    const updateResponse = await PersonDeleteService.run({
      id,
      userId
    })

    response.send(updateResponse)
  }
}

export default new PersonController()
