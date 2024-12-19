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

import PersonTypeEnum from '../../../CoreTypes/Enums/PersonTypeEnum.js'
import User from '../../User/Models/UserModel.js'

/**
 * Model representing the `Person` table in the database.
 *
 * @remarks
 * The attribute types are defined in `IPerson`, derived from `InferAttributes<Person>`.
 *
 */
@Table({ tableName: 'persons' })
class Person extends Model<
  InferAttributes<Person>,
  InferCreationAttributes<Person>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id?: CreationOptional<string>

  @NotNull
  @Attribute(DataTypes.STRING(80))
  declare name: string

  @NotNull
  @Attribute(DataTypes.STRING(60))
  declare email: string

  @Attribute(DataTypes.STRING(11))
  declare phone?: string

  @Attribute(DataTypes.BOOLEAN)
  declare active?: boolean

  @Attribute(DataTypes.STRING(10))
  declare extension?: string

  @Attribute(DataTypes.STRING(120))
  declare neighborhood?: string

  @Attribute(DataTypes.STRING(120))
  declare complement?: string

  @Attribute(DataTypes.STRING(80))
  declare address?: string

  @Attribute(DataTypes.STRING(15))
  declare number?: string

  @Attribute(DataTypes.STRING(80))
  declare city?: string

  @Attribute(DataTypes.STRING(40))
  declare state?: string

  @Default(false)
  @Attribute(PersonTypeEnum.sequelizeEnum())
  declare type: PersonTypeEnum

  @Attribute(DataTypes.UUIDV4)
  @NotNull
  declare userId: string

  @BelongsTo(() => User, 'userId')
  declare user?: NonAttribute<User>
}

/**
 * Type defining the attributes of `Person` model.
 *
 * @typeParam IPerson - Attributes inferred from `Person`.
 */
export type IPerson = InferAttributes<Person>

export default Person
