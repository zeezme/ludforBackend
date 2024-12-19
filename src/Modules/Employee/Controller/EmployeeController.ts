import { Response } from 'express'
import { IDefaultRequest } from '../../../CoreTypes/Types/CoreRoutesTypes.js'
import EmployeeStoreService from '../Services/EmployeeStoreService.js'
import EmployeeUpdateService from '../Services/EmployeeUpdateService.js'
import EmployeeDeleteService from '../Services/EmployeeDeleteService.js'
import Employee from '../Models/EmployeeModel.js'
import User from '../../User/Models/UserModel.js'
import Person from '../../Person/Models/PersonModel.js'
import PermissionService from '../../_Core/Services/PermissionService.js'

class EmployeeController {
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
      permission: 'employee_read'
    })

    const page = Number(request.query.page) || 1
    const pageSize = Number(request.query.pageSize) || 10
    const offset = (page - 1) * pageSize

    const { count, rows: employeeList } = await Employee.findAndCountAll({
      include: [
        {
          model: Person,
          as: 'person',
          include: [
            {
              model: User,
              as: 'user',
              where: {
                id: request.userId
              },
              attributes: ['id', 'username'],
              required: true
            }
          ],
          required: true
        }
      ],
      offset,
      limit: pageSize
    })

    response.json({
      data: employeeList,
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
      permission: 'employee_read'
    })

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: Person,
          as: 'person',
          include: [
            {
              model: User,
              as: 'user',
              where: {
                id: request.userId
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
      throw new Error('Employee not found')
    }

    response.send(employee)
  }

  public async store(
    request: IDefaultRequest,
    response: Response
  ): Promise<void> {
    const { personId } = request.body
    const userId = request.userId

    if (!userId) {
      throw new Error('User not present on default request')
    }

    await PermissionService.verify({
      userId,
      permission: 'employee_create'
    })

    const creationResponse = await EmployeeStoreService.run({
      data: {
        personId
      },
      userId: request.userId
    })

    response.send(creationResponse)
  }

  public async update(
    request: IDefaultRequest,
    response: Response
  ): Promise<void> {
    const { id } = request.params
    const { personId } = request.body
    const userId = request.userId

    if (!userId) {
      throw new Error('User not present on default request')
    }

    await PermissionService.verify({
      userId,
      permission: 'employee_update'
    })

    const updateResponse = await EmployeeUpdateService.run({
      id,
      data: {
        personId
      },
      userId: request.userId
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
      permission: 'employee_delete'
    })

    const updateResponse = await EmployeeDeleteService.run({
      id,
      userId: request.userId
    })

    response.send(updateResponse)
  }
}

export default new EmployeeController()
