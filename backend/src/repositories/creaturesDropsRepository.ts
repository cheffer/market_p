import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'
import { creatureDrop } from '../db/schema'
import type {
  CreaturesDropsParams,
  ErrorHandlerType,
  PostCreaturesDropsBody,
  PutCreaturesDropsBody,
} from '../schemas/types'

interface GetCreaturesDropsQuery {
  creatureId?: string
  itemId?: string
  limit?: number
  offset?: number
}

export async function getCreaturesDropsFromDB(
  filters: GetCreaturesDropsQuery,
  limit: number,
  offset: number
) {
  try {
    const totalCount = await db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(creatureDrop)
      .where(
        and(
          filters.creatureId
            ? like(creatureDrop.creatureId, `%${filters.creatureId}%`)
            : undefined,
          filters.itemId ? eq(creatureDrop.itemId, filters.itemId) : undefined
        )
      )
    const totalRecords = Number(totalCount[0]?.count) || 0
    const query = db
      .select({
        creatureDropId: creatureDrop.creatureDropId,
        creatureId: creatureDrop.creatureId,
        itemId: creatureDrop.itemId,
        dropChance: creatureDrop.dropChance,
        dropAmount: creatureDrop.dropAmount,
        createdAt: creatureDrop.createdAt,
        updatedAt: creatureDrop.updatedAt,
      })
      .from(creatureDrop)

    const conditions = []

    if (filters.creatureId) {
      conditions.push(eq(creatureDrop.creatureId, filters.creatureId))
    }
    if (filters.itemId) {
      conditions.push(eq(creatureDrop.itemId, filters.itemId))
    }

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }
    query.limit(limit).offset(offset)

    const creatureDropResult = await query
    return { creatureDropResult, totalRecords }
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch drop from the database')
  }
}

export async function insertCreaturesDropsIntoDB(
  creatureDropData: PostCreaturesDropsBody
) {
  try {
    await db.insert(creatureDrop).values({
      creatureId: creatureDropData.creatureId,
      itemId: creatureDropData.itemId,
      dropChance: creatureDropData.dropChance,
      dropAmount: creatureDropData.dropAmount,
    })
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function getCountCreaturesDrops(
  creaturesDropsParams: CreaturesDropsParams
) {
  try {
    const query = db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(creatureDrop)
      .where(
        eq(creatureDrop.creatureDropId, creaturesDropsParams.creatureDropId)
      )
    const resultCountCreaturesDrops = await query
    const result = Number(resultCountCreaturesDrops[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch drop from the database')
  }
}

export async function updateCreaturesDropsSetDB(
  creatureDropData: PutCreaturesDropsBody,
  creatureDropParams: CreaturesDropsParams
) {
  try {
    await db
      .update(creatureDrop)
      .set({
        creatureId: creatureDropData.creatureId,
        itemId: creatureDropData.itemId,
        dropChance: creatureDropData.dropChance
          ? Number.parseFloat(creatureDropData.dropChance).toString()
          : null,
        dropAmount: creatureDropData.dropAmount,
        updatedAt: new Date(),
      })
      .where(eq(creatureDrop.creatureDropId, creatureDropParams.creatureDropId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteCreaturesDropsInDB(
  creaturDropParams: CreaturesDropsParams
) {
  try {
    await db
      .delete(creatureDrop)
      .where(eq(creatureDrop.creatureDropId, creaturDropParams.creatureDropId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
