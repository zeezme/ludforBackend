import { BaseEnum } from './BaseEnum.js'

class SuccessFailureEnum extends BaseEnum {
  static readonly SUCCESS = 'success' as const
  static readonly FAILURE = 'failure' as const
}

export default SuccessFailureEnum
