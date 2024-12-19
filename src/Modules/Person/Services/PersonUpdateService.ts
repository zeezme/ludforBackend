import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import PersonRepository from '../Repository/PersonRepository.js'
import sequelize from '../../../../config/database.config.js'
import { CoreBaseServiceUpdateAttributesTypes } from '../../../CoreTypes/Types/CoreBaseServiceAttributesTypes.js'
import { IPersonUpdateServiceAttributes } from '../PersonTypes.js'

class PersonUpdateService {
  /**
   * Updates a person's information in the database.
   *
   * @param attributes - The attributes for the update operation.
   * @param attributes.data - The data to update the person with, including name, email, and type.
   * @param attributes.id - The id of the person to be updated.
   * @param attributes.userId - The id of the user performing the update.
   *
   * @throws {AppError} if the update fails.
   *
   * @returns {Promise<void>} a promise that resolves when the update is completed.
   */

  public async run(
    attributes: CoreBaseServiceUpdateAttributesTypes<IPersonUpdateServiceAttributes>
  ): Promise<string> {
    const personRepository = new PersonRepository()

    try {
      await sequelize.transaction(async transaction => {
        const person = await personRepository.update(
          attributes.data,
          {
            id: attributes.id
          },
          {
            userId: attributes.userId,
            transaction
          }
        )

        if (!person) {
          throw new AppError('Error updating person', 500)
        }
      })
      return 'Person updated successfully!'
    } catch (error) {
      throw new AppError(`Error updating person: ${error}`, 500)
    }
  }
}

export default new PersonUpdateService()
