import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import type { FastifyReply } from 'fastify'
import type {
  CreaturesParams,
  ErrorHandlerType,
  PostCreaturesBody,
  PutCreaturesBody,
} from '../schemas/types'
import {
  deleteCreaturesInDB,
  getCountCreatures,
  getCreaturesFromDB,
  insertCreaturesIntoDB,
  updateCreaturesSetDB,
} from '../repositories/creaturesRepository'
import { creaturesParams } from '../schemas/creaturesSchemas'

interface GetCreaturesQuery {
  name?: string
  type?: string
  location?: string
  limit?: number
  offset?: number
}

export async function getCreaturesService(
  filters: GetCreaturesQuery,
  limit: number,
  offset: number
) {
  const { creatureResult, totalRecords } = await getCreaturesFromDB(
    filters,
    limit,
    offset
  )
  const fullPage = Math.ceil(totalRecords / limit)
  if (creatureResult.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    creatures: creatureResult,
    pagination: {
      totalRecords,
      pagina: Math.floor(offset / limit) + 1,
      fullPage,
      limit,
      offset,
    },
  }
}

export async function postCreaturesService(creatureData: PostCreaturesBody) {
  try {
    await insertCreaturesIntoDB(creatureData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function putCreaturesService(
  creatureData: PutCreaturesBody,
  creatureParams: CreaturesParams
) {
  try {
    const resultCountCreature = await getCountCreatures(creatureParams)
    if (resultCountCreature === 0) {
      throw new NotFoundError('Creature not found')
    }
    await updateCreaturesSetDB(creatureData, creatureParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteCreaturesService(creatureParams: CreaturesParams) {
  try {
    const resultCountCreature = await getCountCreatures(creatureParams)
    if (resultCountCreature === 0) {
      throw new NotFoundError('Creature not found')
    }
    await deleteCreaturesInDB(creatureParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
