import { AppError } from '../../_Core/Middleware/ErrorHandler.js'

import sequelize from '../../../../config/database.config.js'
import { CoreBaseServiceStoreAttributesTypes } from '../../../CoreTypes/Types/CoreBaseServiceAttributesTypes.js'
import { IEmployeeStoreServiceAttributes } from '../EmployeeTypes.js'
import EmployeeRepository from '../Repository/EmployeeRepository.js'

class EmployeeStoreService {
  /**
   * Creates a new employee in the database.
   *
   * @param attributes - The attributes for the creation operation.
   * @param attributes.data - The data to create the employee with.
   * @param attributes.userId - The id of the user performing the creation.
   *
   * @throws {AppError} if the creation fails.
   *
   * @returns {Promise<void>} a promise that resolves when the creation is done.
   */
  public async run(
    attributes: CoreBaseServiceStoreAttributesTypes<IEmployeeStoreServiceAttributes>
  ): Promise<string> {
    const { personId } = attributes.data
    const employeeRepository = new EmployeeRepository()

    try {
      await sequelize.transaction(async transaction => {
        const employee = await employeeRepository.create(
          {
            personId
          },
          {
            userId: attributes.userId,
            transaction
          }
        )

        if (!employee) {
          throw new AppError('Error creating employee', 500)
        }
      })

      return 'Employee created successfully!'
    } catch (error) {
      throw new AppError(`Error creating employee: ${error}`, 500)
    }
  }
}

export default new EmployeeStoreService()
