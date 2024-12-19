import { BaseEnum } from './BaseEnum.js'

class PermissionTypeEnum extends BaseEnum {
  static readonly MODULE = 'module' as const
  static readonly MENU = 'menu' as const
}

export default PermissionTypeEnum
