import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import type { FastifyReply } from 'fastify'
import type {
  CraftsParams,
  ErrorHandlerType,
  PostCraftsBody,
  PutCraftsBody,
} from '../schemas/types'
import {
  deleteCraftsInDB,
  getCountCrafts,
  getCraftsFromDB,
  insertCraftsIntoDB,
  updateCraftsSetDB,
} from '../repositories/craftsRepository'

interface GetCraftsQuery {
  itemId?: string
  professionId?: string
  requiredRank?: string
  requiredSkill?: number
  limit?: number
  offset?: number
}

// Function to ensure that requiredRank is valid and capitalized
function formatRequiredRank(
  requiredRank: string | undefined
): string | undefined {
  if (!requiredRank) return requiredRank
  const validRanks = ['A', 'B', 'C', 'D', 'E']
  const upperCaseRank = requiredRank.toUpperCase()

  if (validRanks.includes(upperCaseRank)) {
    return upperCaseRank
  }

  throw new ValidationError(
    'Invalid requiredRank. Only A, B, C, D, E are allowed.'
  )
}

export async function getCraftsService(
  filters: GetCraftsQuery,
  limit: number,
  offset: number
) {
  if (filters.requiredRank) {
    filters.requiredRank = formatRequiredRank(filters.requiredRank)
  }
  const { craftResult, totalRecords } = await getCraftsFromDB(
    filters,
    limit,
    offset
  )
  const fullPage = Math.ceil(totalRecords / limit)
  if (craftResult.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    craft: craftResult,
    pagination: {
      totalRecords,
      pagina: Math.floor(offset / limit) + 1,
      fullPage,
      limit,
      offset,
    },
  }
}

export async function postCraftsService(craftData: PostCraftsBody) {
  try {
    if (craftData.requiredRank) {
      craftData.requiredRank = formatRequiredRank(craftData.requiredRank)
    }
    await insertCraftsIntoDB(craftData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function putCraftsService(
  craftData: PutCraftsBody,
  craftParams: CraftsParams
) {
  try {
    const resultCountCraft = await getCountCrafts(craftParams)
    if (resultCountCraft === 0) {
      throw new NotFoundError('Craft not found')
    }
    if (craftData.requiredRank) {
      craftData.requiredRank = formatRequiredRank(craftData.requiredRank)
    }
    await updateCraftsSetDB(craftData, craftParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteCraftsService(craftParams: CraftsParams) {
  try {
    const resultCountCraft = await getCountCrafts(craftParams)
    if (resultCountCraft === 0) {
      throw new NotFoundError('Craft not found')
    }
    await deleteCraftsInDB(craftParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
