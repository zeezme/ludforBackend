import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import { IPersonStoreServiceAttributes } from '../PersonTypes.js'
import PersonRepository from '../Repository/PersonRepository.js'
import sequelize from '../../../../config/database.config.js'
import { CoreBaseServiceStoreAttributesTypes } from '../../../CoreTypes/Types/CoreBaseServiceAttributesTypes.js'

class PersonStoreService {
  /**
   * Creates a new person in the database.
   *
   * @param attributes - The attributes for the creation operation.
   * @param attributes.data - The data to create the person with.
   * @param attributes.userId - The id of the user performing the creation.
   *
   * @throws {AppError} if the creation fails.
   *
   * @returns {Promise<void>} a promise that resolves when the creation is done.
   */
  public async run(
    attributes: CoreBaseServiceStoreAttributesTypes<IPersonStoreServiceAttributes>
  ): Promise<string> {
    const { name, email, type } = attributes.data
    const { userId } = attributes

    const personRepository = new PersonRepository()

    if (!userId) {
      throw new AppError('User id is required', 400)
    }

    try {
      await sequelize.transaction(async transaction => {
        const person = await personRepository.create(
          {
            name,
            email,
            type,
            userId
          },
          {
            userId,
            transaction
          }
        )

        if (!person) {
          throw new AppError('Error creating person', 500)
        }
      })

      return 'Person created successfully'
    } catch (error) {
      throw new AppError(`Error creating person: ${error}`, 500)
    }
  }
}

export default new PersonStoreService()
