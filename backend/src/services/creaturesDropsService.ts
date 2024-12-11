import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import type { FastifyReply } from 'fastify'
import type {
  CreaturesDropsParams,
  ErrorHandlerType,
  PostCreaturesDropsBody,
  PutCreaturesDropsBody,
} from '../schemas/types'
import {
  deleteCreaturesDropsInDB,
  getCountCreaturesDrops,
  getCreaturesDropsFromDB,
  insertCreaturesDropsIntoDB,
  updateCreaturesDropsSetDB,
} from '../repositories/creaturesDropsRepository'

interface GetCreaturesDropsQuery {
  creatureId?: string
  itemId?: string
  limit?: number
  offset?: number
}

export async function getCreaturesDropsService(
  filters: GetCreaturesDropsQuery,
  limit: number,
  offset: number
) {
  const { creatureDropResult, totalRecords } = await getCreaturesDropsFromDB(
    filters,
    limit,
    offset
  )
  const fullPage = Math.ceil(totalRecords / limit)
  if (creatureDropResult.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    drops: creatureDropResult,
    pagination: {
      totalRecords,
      pagina: Math.floor(offset / limit) + 1,
      fullPage,
      limit,
      offset,
    },
  }
}

export async function postCreaturesDropsService(
  creatureDropData: PostCreaturesDropsBody
) {
  try {
    await insertCreaturesDropsIntoDB(creatureDropData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function putCreaturesDropsService(
  creatureDropData: PutCreaturesDropsBody,
  creatureDropParams: CreaturesDropsParams
) {
  try {
    const resultCountCreatureDrop =
      await getCountCreaturesDrops(creatureDropParams)
    if (resultCountCreatureDrop === 0) {
      throw new NotFoundError('Drop not found')
    }
    await updateCreaturesDropsSetDB(creatureDropData, creatureDropParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteCreaturesDropsService(
  creatureDropParams: CreaturesDropsParams
) {
  try {
    const resultCountCreatureDrop =
      await getCountCreaturesDrops(creatureDropParams)
    if (resultCountCreatureDrop === 0) {
      throw new NotFoundError('Craft not found')
    }
    await deleteCreaturesDropsInDB(creatureDropParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
