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
  GetCreaturesQuery,
  PostCreaturesBody,
  PutCreaturesBody,
} from '../schemas/types'
import {
  deleteCreaturesInDB,
  getCheckCreature,
  getCountCreatures,
  getCreatureById,
  getCreaturesFromDB,
  insertCreaturesIntoDB,
  updateCreaturesSetDB,
} from '../repositories/creaturesRepository'
import { creaturesParams } from '../schemas/creaturesSchemas'

export async function getCreaturesService(filters: GetCreaturesQuery) {
  const { creatureResult, totalRecords } = await getCreaturesFromDB(filters)
  const fullPage = Math.ceil(totalRecords / filters.limit)
  if (creatureResult.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    creatures: creatureResult,
    pagination: {
      totalRecords,
      pagina: Math.floor(filters.offset / filters.limit) + 1,
      fullPage,
    },
  }
}

export async function postCreaturesService(creatureData: PostCreaturesBody) {
  const checkCreature = {
    name: creatureData.name,
    type: creatureData.type,
    location: creatureData.location,
  }
  try {
    const resultcheckCreature = await getCheckCreature(checkCreature)

    if (resultcheckCreature > 0) {
      throw new NotFoundError(
        'A creature with that name, type and location already exists'
      )
    }
    await insertCreaturesIntoDB(creatureData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function putCreaturesService(
  creatureData: PutCreaturesBody,
  creatureParams: CreaturesParams
) {
  const checkCreature = {
    name: creatureData.name,
    type: creatureData.type,
    location: creatureData.location,
  }
  try {
    const { checkName, checkType, checkLocation } =
      await getCreatureById(creatureParams)
    if (
      checkName !== creatureData.name ||
      checkType !== creatureData.type ||
      checkLocation !== creatureData.location
    ) {
      const resultcheckCreature = await getCheckCreature(checkCreature)

      if (resultcheckCreature > 0) {
        throw new NotFoundError(
          'A creature with that name, type and location already exists'
        )
      }
    }
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
