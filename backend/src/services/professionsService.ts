import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import type { FastifyReply } from 'fastify'
import type {
  ErrorHandlerType,
  GetProfessionsQuery,
  InputProfessionsBody,
  ProfessionsParams,
} from '../schemas/types'
import {
  deleteProfessionsInDB,
  getCountProfessions,
  getProfessionsFromDB,
  insertProfessionsIntoDB,
  updateProfessionsSetDB,
} from '../repositories/professionsRepository'

export async function getProfessionsService(filters: GetProfessionsQuery) {
  const professionsResult = await getProfessionsFromDB(filters)

  if (professionsResult.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    professionsResult,
  }
}

export async function postProfessionsService(
  professionData: InputProfessionsBody
) {
  try {
    await insertProfessionsIntoDB(professionData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function putProfessionsService(
  professionData: InputProfessionsBody,
  professionParams: ProfessionsParams
) {
  try {
    const resultCountProfession = await getCountProfessions(professionParams)
    if (resultCountProfession === 0) {
      throw new NotFoundError('Profession not found')
    }
    await updateProfessionsSetDB(professionData, professionParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteProfessionsService(
  professionParams: ProfessionsParams
) {
  try {
    const resultCountProfession = await getCountProfessions(professionParams)
    if (resultCountProfession === 0) {
      throw new NotFoundError('Profession not found')
    }
    await deleteProfessionsInDB(professionParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
