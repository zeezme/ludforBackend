import { BaseEnum } from './BaseEnum.js'

class PersonTypeEnum extends BaseEnum {
  static readonly USER = 'user' as const
  static readonly ADMIN = 'admin' as const
}

export default PersonTypeEnum
