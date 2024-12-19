import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  sql,
  Transaction
} from '@sequelize/core'

import {
  Attribute,
  BelongsTo,
  BelongsToMany,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  Table
} from '@sequelize/core/decorators-legacy'

import Permission from '../../Permission/Models/PermissionModel.js'
import Person from '../../Person/Models/PersonModel.js'
import Authentication from '../../Authentication/Models/AuthenticationModel.js'
import Log from '../../_Core/Audit/Model/Log.js'
import { v4 } from 'uuid'
import UserPermission from '../../UserPermission/Models/UsersPermissions.js'

/**
 * Model representing the `User` table in the database.
 *
 * @remarks
 * The attribute types are defined in `IUser`, derived from `InferAttributes<User>`.
 *
 */
@Table({ tableName: 'users' })
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id?: CreationOptional<string>

  @NotNull
  @Attribute(DataTypes.STRING(20))
  declare username: string

  @NotNull
  @Attribute(DataTypes.STRING(80))
  declare password: string

  @NotNull
  @Attribute(DataTypes.STRING(60))
  declare email: string

  @BelongsToMany(() => Permission, {
    through: UserPermission,
    foreignKey: 'userId',
    otherKey: 'permissionId'
  })
  declare permissions?: NonAttribute<Permission[]>

  declare addPermission: BelongsToManyAddAssociationMixin<
    Permission,
    Permission['id']
  >

  declare addPermissions: BelongsToManyAddAssociationsMixin<
    Permission,
    Permission['id']
  >

  @HasMany(() => Authentication, { foreignKey: 'userId' })
  declare authentications?: NonAttribute<Authentication[]>

  @HasMany(() => Log, { foreignKey: 'userId' })
  declare Logs?: NonAttribute<Log[]>

  @HasMany(() => Person, { foreignKey: 'userId' })
  declare persons?: NonAttribute<Person[]>

  @Attribute(DataTypes.UUID)
  declare personId?: CreationOptional<string>

  @BelongsTo(() => Person, { foreignKey: 'personId' })
  declare person?: NonAttribute<Person>

  async addPermissionsByDescription(
    descriptions: string[],
    transaction?: Transaction
  ) {
    try {
      for (const description of descriptions) {
        let permission = await Permission.findOne({
          where: { description },
          transaction
        })

        if (!permission) {
          throw new Error(`Permission ${description} not found`)
        }

        await this.addPermission(permission, { transaction })
      }
    } catch (error) {
      throw new Error(`Error adding permissions: ${error}`)
    }
  }
}

/**
 * Type defining the attributes of `User` model.
 *
 * @typeParam IUser - Attributes inferred from `User`.
 */
export type IUser = InferAttributes<User>

export default User
