import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import sequelize from '../../../../config/database.config.js'
import { CoreBaseServiceUpdateAttributesTypes } from '../../../CoreTypes/Types/CoreBaseServiceAttributesTypes.js'
import { IEmployeeUpdateServiceAttributes } from '../EmployeeTypes.js'
import EmployeeRepository from '../Repository/EmployeeRepository.js'

class EmployeeUpdateService {
  /**
   * Updates a employee's information in the database.
   *
   * @param attributes - The attributes for the update operation.
   * @param attributes.data - The data to update the employee with, including personId.
   * @param attributes.id - The id of the employee to be updated.
   * @param attributes.userId - The id of the user performing the update.
   *
   * @throws {AppError} if the update fails.
   *
   * @returns {Promise<void>} a promise that resolves when the update is completed.
   */

  public async run(
    attributes: CoreBaseServiceUpdateAttributesTypes<IEmployeeUpdateServiceAttributes>
  ): Promise<string> {
    const { personId } = attributes.data
    const employeeRepository = new EmployeeRepository()

    try {
      await sequelize.transaction(async transaction => {
        const employee = await employeeRepository.update(
          {
            personId
          },
          {
            id: attributes.id
          },
          {
            userId: attributes.userId,
            transaction
          }
        )

        if (!employee) {
          throw new AppError('Error updating employee', 500)
        }
      })

      return 'Employee updated successfully!'
    } catch (error) {
      throw new AppError(`Error updating employee: ${error}`, 500)
    }
  }
}

export default new EmployeeUpdateService()
