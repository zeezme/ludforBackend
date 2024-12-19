import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import sequelize from '../../../../config/database.config.js'
import { CoreBaseServiceDeleteAttributesTypes } from '../../../CoreTypes/Types/CoreBaseServiceAttributesTypes.js'
import EmployeeRepository from '../Repository/EmployeeRepository.js'

class EmployeeDeleteService {
  /**
   * Deletes a employee from the database.
   *
   * @param attributes - The attributes for the deletion operation.
   * @param attributes.id - The id of the employee to be deleted.
   * @param attributes.userId - The id of the user performing the deletion.
   *
   * @throws {AppError} if the deletion fails.
   *
   * @returns {Promise<void>} a promise that resolves when the deletion is done.
   */
  public async run(
    attributes: CoreBaseServiceDeleteAttributesTypes
  ): Promise<string> {
    const employeeRepository = new EmployeeRepository()

    try {
      await sequelize.transaction(async transaction => {
        const employee = await employeeRepository.delete(
          {
            id: attributes.id
          },
          {
            userId: attributes.userId,
            transaction
          }
        )

        if (!employee) {
          throw new AppError('Error deleting employee', 500)
        }
      })

      return 'Employee deleted successfully!'
    } catch (error) {
      throw new AppError(`Error deleting employee: ${error}`, 500)
    }
  }
}

export default new EmployeeDeleteService()
