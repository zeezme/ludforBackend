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
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
  Table
} from '@sequelize/core/decorators-legacy'

import User from '../../User/Models/UserModel.js'

/**
 * Model representing the `Authentication` table in the database.
 *
 * @remarks
 * The attribute types are defined in `IAuthentication`, derived from `InferAttributes<Authentication>`.
 *
 */
@Table({ tableName: 'authentications' })
class Authentication extends Model<
  InferAttributes<Authentication>,
  InferCreationAttributes<Authentication>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id: CreationOptional<string>

  @NotNull
  @Attribute(DataTypes.STRING)
  declare token: string

  @Attribute(DataTypes.DATE)
  declare expiresAt?: Date

  @Attribute(DataTypes.DATE)
  declare revokedAt?: Date

  @Attribute(DataTypes.UUIDV4)
  @NotNull
  declare userId: string

  @BelongsTo(() => User, 'userId')
  declare user?: NonAttribute<User>
}

/**
 * Type defining the attributes of `Authentication` model.
 *
 * @typeParam IAuthentication - Attributes inferred from `Authentication`.
 */
export type IAuthentication = InferAttributes<Authentication>

export default Authentication
