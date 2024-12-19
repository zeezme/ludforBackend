import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  sql
} from '@sequelize/core'

import {
  Attribute,
  BelongsToMany,
  Default,
  NotNull,
  PrimaryKey,
  Table,
  Unique
} from '@sequelize/core/decorators-legacy'

import User from '../../User/Models/UserModel.js'
import UserPermission from '../../UserPermission/Models/UsersPermissions.js'

/**
 * Model representing the `Permission` table in the database.
 *
 * @remarks
 * The attribute types are defined in `IPermission`, derived from `InferAttributes<Permission>`.
 *
 */
@Table({ tableName: 'permissions' })
class Permission extends Model<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id?: CreationOptional<string>

  @NotNull
  @Attribute(DataTypes.STRING(255))
  @Unique
  declare description: string

  @BelongsToMany(() => User, {
    through: UserPermission,
    foreignKey: 'permissionId',
    otherKey: 'userId'
  })
  declare users?: NonAttribute<User[]>
}

/**
 * Type defining the attributes of `Permission` model.
 *
 * @typeParam IPermission - Attributes inferred from `Permission`.
 */
export type IPermission = InferAttributes<Permission>

export default Permission
