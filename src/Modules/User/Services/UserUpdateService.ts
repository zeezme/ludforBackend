import { AppError } from '../../_Core/Middleware/ErrorHandler.js'
import sequelize from '../../../../config/database.config.js'
import { CoreBaseServiceUpdateAttributesTypes } from '../../../CoreTypes/Types/CoreBaseServiceAttributesTypes.js'
import { IUserUpdateServiceAttributes } from '../UserTypes.js'
import UserRepository from '../Repository/UserRepository.js'
import Person from '../../Person/Models/PersonModel.js'

class UserUpdateService {
  /**
   * Updates a User's information in the database.
   *
   * @param attributes - The attributes for the update operation.
   * @param attributes.data - The data to update the User with, including name, email, and type.
   * @param attributes.id - The id of the User to be updated.
   * @param attributes.userId - The id of the user performing the update.
   *
   * @throws {AppError} if the update fails.
   *
   * @returns {Promise<void>} a promise that resolves when the update is completed.
   */

  public async run(
    attributes: CoreBaseServiceUpdateAttributesTypes<IUserUpdateServiceAttributes>
  ): Promise<void> {
    const { email, personId } = attributes.data
    const userRepository = new UserRepository()

    const person = await Person.findByPk(personId)

    if (!person) {
      throw new AppError('Person not found', 404)
    }

    try {
      await sequelize.transaction(async transaction => {
        const User = await userRepository.update(
          {
            personId,
            email
          },
          {
            where: {
              id: attributes.id
            }
          },
          {
            userId: attributes.userId,
            transaction
          }
        )

        if (!User) {
          throw new AppError('Error creating User', 500)
        }
      })
    } catch (error) {
      throw new AppError(`Error creating User: ${error}`, 500)
    }
  }
}

export default new UserUpdateService()
