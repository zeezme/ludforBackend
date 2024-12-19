import {
  Attributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  WhereOptions
} from '@sequelize/core'

import SuccessFailureEnum from '../../../CoreTypes/Enums/SuccessFailureEnum.js'
import IDefaultBaseRepositoryParams from '../../../CoreTypes/Types/CoreBaseRepositoryTypes.js'
import Log from '../Audit/Model/Log.js'

type CreationAttributes<T extends Model> = InferCreationAttributes<T>
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

class BaseRepository<T extends Model<any, any>> {
  protected model: ModelStatic<T>

  constructor(model: ModelStatic<T>) {
    this.model = model
  }

  public async create(
    data: Expand<CreationAttributes<T>>,
    { userId, disableLogging, transaction }: IDefaultBaseRepositoryParams
  ): Promise<T> {
    let generatedSQL = ''
    let entityId: string | null = null

    try {
      const entity = await this.model.create(data as any, {
        logging: sql => {
          generatedSQL = sql
        },
        transaction
      })

      entityId = (entity as any).id

      if (!entityId) {
        throw new Error(`Entity ${this.model.name} did not return an id`)
      }

      if (
        userId &&
        (disableLogging === false || disableLogging === undefined)
      ) {
        await Log.create({
          userId,
          entity: this.model.name,
          entityId,
          action: 'create',
          query: generatedSQL,
          status: SuccessFailureEnum.SUCCESS
        })
      }

      return entity
    } catch (error) {
      const query = generatedSQL || JSON.stringify(data)
      if (
        userId &&
        (disableLogging === false || disableLogging === undefined)
      ) {
        if (userId) {
          await Log.create({
            userId,
            entity: this.model.name,
            entityId,
            action: 'creation-failed',
            query,
            status: SuccessFailureEnum.FAILURE
          })
        }
      }

      throw error
    }
  }

  public async update(
    data: Expand<Partial<CreationAttributes<T>>>,
    where: WhereOptions<Attributes<T>>,
    { userId, disableLogging, transaction }: IDefaultBaseRepositoryParams
  ): Promise<number> {
    let generatedSQL = ''

    try {
      const [affectedRows] = await this.model.update(data as any, {
        where,
        logging: sql => {
          generatedSQL = sql
        },
        transaction
      })

      if (
        userId &&
        (disableLogging === false || disableLogging === undefined)
      ) {
        await Log.create({
          userId,
          entity: this.model.name,
          entityId: (where as any).id ?? null,
          action: 'update',
          query: generatedSQL,
          status: SuccessFailureEnum.SUCCESS
        })
      }

      return affectedRows
    } catch (error) {
      const query = generatedSQL || JSON.stringify({ data, where })
      if (
        userId &&
        (disableLogging === false || disableLogging === undefined)
      ) {
        await Log.create({
          userId,
          entity: this.model.name,
          entityId: (where as any).id ?? null,
          action: 'update-failed',
          query,
          status: SuccessFailureEnum.FAILURE
        })
      }

      throw error
    }
  }

  public async delete(
    where: WhereOptions<Attributes<T>>,
    { userId, disableLogging, transaction }: IDefaultBaseRepositoryParams
  ): Promise<string> {
    let generatedSQL = ''

    try {
      const affectedRows = await this.model.destroy({
        where,
        logging: sql => {
          generatedSQL = sql
        },
        transaction
      })

      if (
        userId &&
        (disableLogging === false || disableLogging === undefined)
      ) {
        await Log.create({
          userId,
          entity: this.model.name,
          entityId: (where as any).id ?? null,
          action: 'delete',
          query: generatedSQL,
          status: SuccessFailureEnum.SUCCESS
        })
      }

      return `Deleted ${affectedRows} rows`
    } catch (error) {
      const query = generatedSQL || JSON.stringify({ where })
      if (
        userId &&
        (disableLogging === false || disableLogging === undefined)
      ) {
        await Log.create({
          userId,
          entity: this.model.name,
          entityId: JSON.stringify(where),
          action: 'deletion-failed',
          query,
          status: SuccessFailureEnum.FAILURE
        })
      }

      throw error
    }
  }
}

export default BaseRepository
