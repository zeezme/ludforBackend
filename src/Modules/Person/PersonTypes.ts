// #region Services

import PersonTypeEnum from '../../CoreTypes/Enums/PersonTypeEnum.js'

export interface IPersonStoreServiceAttributes {
  name: string
  email: string
  type: PersonTypeEnum
}

export interface IPersonUpdateServiceAttributes {
  name: string
  email: string
  type: PersonTypeEnum
}

// #endregion Services
