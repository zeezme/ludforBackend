import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql
} from '@sequelize/core'
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default
} from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'usersPermissions' })
class UserPermission extends Model<
  InferAttributes<UserPermission>,
  InferCreationAttributes<UserPermission>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id?: CreationOptional<string>

  @NotNull
  @Attribute(DataTypes.UUID)
  declare userId: string

  @NotNull
  @Attribute(DataTypes.UUID)
  declare permissionId: string
}

export default UserPermission
