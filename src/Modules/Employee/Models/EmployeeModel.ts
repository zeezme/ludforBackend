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

import Person from '../../Person/Models/PersonModel.js'

/**
 * Model representing the `Employee` table in the database.
 *
 * @remarks
 * The attribute types are defined in `IEmployee`, derived from `InferAttributes<Employee>`.
 *
 */
@Table({ tableName: 'employees' })
class Employee extends Model<
  InferAttributes<Employee>,
  InferCreationAttributes<Employee>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id?: CreationOptional<string>

  @Attribute(DataTypes.UUIDV4)
  @NotNull
  declare personId: string

  @BelongsTo(() => Person, 'personId')
  declare person?: NonAttribute<Person>
}

/**
 * Type defining the attributes of `Employee` model.
 *
 * @typeParam IEmployee - Attributes inferred from `Employee`.
 */
export type IEmployee = InferAttributes<Employee>

export default Employee
