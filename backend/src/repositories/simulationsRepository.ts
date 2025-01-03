import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'
import { simulation } from '../db/schema'
import type {
  ErrorHandlerType,
  GetSimulationsQuery,
  PostSimulationsBody,
  PutSimulationsBody,
  SimulationsParams,
} from '../schemas/types'

export async function getSimulationsFromDB(filters: GetSimulationsQuery) {
  try {
    const totalCount = await db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(simulation)
      .where(
        and(
          filters.itemId
            ? like(simulation.itemId, `%${filters.itemId}%`)
            : undefined
        )
      )
    const totalRecords = Number(totalCount[0]?.count) || 0
    const query = db
      .select({
        simulationId: simulation.simulationId,
        itemId: simulation.itemId,
        quantity: simulation.quantity,
        minBuyCost: simulation.minBuyCost,
        avgBuyCost: simulation.avgBuyCost,
        maxBuyCost: simulation.maxBuyCost,
        currentBuyCost: simulation.currentBuyCost,
        minSellProfit: simulation.minSellProfit,
        avgSellProfit: simulation.avgSellProfit,
        maxSellProfit: simulation.maxSellProfit,
        currentSellProfit: simulation.currentSellProfit,
        createdAt: simulation.createdAt,
        updatedAt: simulation.updatedAt,
      })
      .from(simulation)

    const conditions = []

    if (filters.itemId) {
      conditions.push(eq(simulation.itemId, filters.itemId))
    }

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    query.limit(filters.limit).offset(filters.offset)

    const simulationResult = await query
    return { simulationResult, totalRecords }
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch simulation from the database')
  }
}

export async function insertSimulationsIntoDB(
  simulationData: PostSimulationsBody
) {
  try {
    await db.insert(simulation).values({
      itemId: simulationData.itemId,
      quantity: simulationData.quantity,
      currentSellProfit: simulationData.currentSellProfit,
      currentBuyCost: simulationData.currentBuyCost,
    })
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function getCountSimulations(simulationParams: SimulationsParams) {
  try {
    const query = db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(simulation)
      .where(eq(simulation.simulationId, simulationParams.simulationId))
    const resultCountsimulations = await query
    const result = Number(resultCountsimulations[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch simulation from the database')
  }
}

export async function updateSimulationsSetDB(
  simulationData: PutSimulationsBody,
  simulationParams: SimulationsParams
) {
  try {
    await db
      .update(simulation)
      .set({
        quantity: simulationData.quantity,
        currentSellProfit: simulationData.currentSellProfit
          ? Number.parseFloat(simulationData.currentSellProfit).toString()
          : '0',
        currentBuyCost: simulationData.currentBuyCost
          ? Number.parseFloat(simulationData.currentBuyCost).toString()
          : '0',
        updatedAt: new Date(),
      })
      .where(eq(simulation.simulationId, simulationParams.simulationId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteSimulationsInDB(
  simulationParams: SimulationsParams
) {
  try {
    await db
      .delete(simulation)
      .where(eq(simulation.simulationId, simulationParams.simulationId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
