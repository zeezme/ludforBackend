import { Transaction } from '@sequelize/core'

export default interface IDefaultBaseRepositoryParams {
  userId?: string
  disableLogging?: boolean
  transaction?: Transaction
}
