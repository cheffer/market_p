import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import type { FastifyReply } from 'fastify'
import type {
  ErrorHandlerType,
  GetSimulationsQuery,
  PostSimulationsBody,
  PutSimulationsBody,
  SimulationsParams,
} from '../schemas/types'
import {
  deleteSimulationsInDB,
  getCountSimulations,
  getSimulationsFromDB,
  insertSimulationsIntoDB,
  updateSimulationsSetDB,
} from '../repositories/simulationsRepository'

export async function getSimulationsService(filters: GetSimulationsQuery) {
  const { simulationResult, totalRecords } = await getSimulationsFromDB(filters)
  const fullPage = Math.ceil(totalRecords / filters.limit)
  if (simulationResult.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    simulationsResult: simulationResult,
    pagination: {
      totalRecords,
      pagina: Math.floor(filters.offset / filters.limit) + 1,
      fullPage,
    },
  }
}

export async function postSimulationsService(
  simulationData: PostSimulationsBody
) {
  try {
    await insertSimulationsIntoDB(simulationData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function putSimulationsService(
  simulationData: PutSimulationsBody,
  simulationParams: SimulationsParams
) {
  try {
    const resultCountSimulation = await getCountSimulations(simulationParams)
    if (resultCountSimulation === 0) {
      throw new NotFoundError('simulation not found')
    }
    await updateSimulationsSetDB(simulationData, simulationParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteSimulationsService(
  simulationParams: SimulationsParams
) {
  try {
    const resultCountSimulation = await getCountSimulations(simulationParams)
    if (resultCountSimulation === 0) {
      throw new NotFoundError('simulation not found')
    }
    await deleteSimulationsInDB(simulationParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
