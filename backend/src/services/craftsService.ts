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
  GetCraftsQuery,
  PostCraftsBody,
  PutCraftsBody,
} from '../schemas/types'
import {
  deleteCraftsInDB,
  getCheckCraft,
  getCountCrafts,
  getCraftById,
  getCraftsFromDB,
  insertCraftsIntoDB,
  updateCraftsSetDB,
} from '../repositories/craftsRepository'

// Function to ensure that requiredRank is valid and capitalized
function formatRequiredRank(
  requiredRank: string | undefined
): string | undefined {
  if (!requiredRank) return requiredRank
  const validRanks = ['A', 'B', 'C', 'D', 'E', 'S']
  const upperCaseRank = requiredRank.toUpperCase()

  if (validRanks.includes(upperCaseRank)) {
    return upperCaseRank
  }

  throw new ValidationError(
    'Invalid requiredRank. Only A, B, C, D, E, S are allowed.'
  )
}

export async function getCraftsService(filters: GetCraftsQuery) {
  if (filters.requiredRank) {
    filters.requiredRank = formatRequiredRank(filters.requiredRank)
  }
  const { craftResult, totalRecords } = await getCraftsFromDB(filters)
  const fullPage = Math.ceil(totalRecords / filters.limit)
  if (craftResult.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    crafts: craftResult,
    pagination: {
      totalRecords,
      pagina: Math.floor(filters.offset / filters.limit) + 1,
      fullPage,
    },
  }
}

export async function postCraftsService(craftData: PostCraftsBody) {
  const checkCraft = {
    itemId: craftData.itemId,
    professionId: craftData.professionId,
  }
  try {
    const resultcheckCraft = await getCheckCraft(checkCraft)

    if (resultcheckCraft > 0) {
      throw new NotFoundError(
        'There is already a craft for this item for this profession'
      )
    }
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
  const checkCraft = {
    itemId: craftData.itemId,
    professionId: craftData.professionId,
  }
  try {
    const { checkItemId, checkProfessionId } = await getCraftById(craftParams)
    if (
      checkItemId !== craftData.itemId ||
      checkProfessionId !== craftData.professionId
    ) {
      const resultcheckCraft = await getCheckCraft(checkCraft)

      if (resultcheckCraft > 0) {
        throw new NotFoundError(
          'There is already a craft for this item for this profession'
        )
      }
    }

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
