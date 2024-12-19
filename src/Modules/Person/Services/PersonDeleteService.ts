import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import PersonRepository from '../Repository/PersonRepository.js'
import sequelize from '../../../../config/database.config.js'
import { CoreBaseServiceDeleteAttributesTypes } from '../../../CoreTypes/Types/CoreBaseServiceAttributesTypes.js'

class PersonDeleteService {
  /**
   * Deletes a person from the database.
   *
   * @param attributes - The attributes for the deletion operation.
   * @param attributes.id - The id of the person to be deleted.
   * @param attributes.userId - The id of the user performing the deletion.
   *
   * @throws {AppError} if the deletion fails.
   *
   * @returns {Promise<void>} a promise that resolves when the deletion is done.
   */
  public async run(
    attributes: CoreBaseServiceDeleteAttributesTypes
  ): Promise<string> {
    const personRepository = new PersonRepository()

    try {
      await sequelize.transaction(async transaction => {
        const person = await personRepository.delete(
          {
            id: attributes.id
          },
          {
            userId: attributes.userId,
            transaction
          }
        )

        if (!person) {
          throw new AppError('Error deleting person', 500)
        }
      })

      return 'Person deleted successfully!'
    } catch (error) {
      throw new AppError(`Error deleting person: ${error}`, 500)
    }
  }
}

export default new PersonDeleteService()
