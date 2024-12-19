import { DataTypes } from '@sequelize/core'

abstract class BaseEnum {
  static typeEnum(): string[] {
    return Object.values(this).filter(
      value => typeof value === 'string'
    ) as string[]
  }

  static sequelizeEnum(
    ...args: (string | { values: string[] })[]
  ): ReturnType<typeof DataTypes.ENUM> {
    const values =
      args.length === 1 && typeof args[0] === 'object' && 'values' in args[0]
        ? args[0].values
        : (args as string[]).length > 0
          ? (args as string[])
          : this.typeEnum()

    return DataTypes.ENUM(...values)
  }
}

type EnumType<T extends typeof BaseEnum> = Extract<T[keyof T], string>

export { BaseEnum, EnumType }
