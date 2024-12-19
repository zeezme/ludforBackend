import {
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

import SuccessFailureEnum from '../../../../CoreTypes/Enums/SuccessFailureEnum.js'
import User from '../../../User/Models/UserModel.js'

@Table({ tableName: 'logs' })
class Log extends Model<InferAttributes<Log>, InferCreationAttributes<Log>> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id?: string

  @NotNull
  @Attribute(DataTypes.STRING)
  declare action: string

  @NotNull
  @Attribute(DataTypes.STRING)
  declare entity: string

  @NotNull
  @Attribute(DataTypes.UUID)
  declare entityId: string | null

  @Attribute(DataTypes.STRING)
  declare query: string | null

  @NotNull
  @Attribute(SuccessFailureEnum.sequelizeEnum())
  declare status: SuccessFailureEnum

  @Attribute(DataTypes.UUIDV4)
  @NotNull
  declare userId: string

  @BelongsTo(() => User, 'userId')
  declare user?: NonAttribute<User>
}

export default Log
