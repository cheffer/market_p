import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'
import type {
  CraftsParams,
  ErrorHandlerType,
  PostCraftsBody,
  PutCraftsBody,
} from '../schemas/types'
import { craft } from '../db/schema'

interface GetCraftsQuery {
  itemId?: string
  professionId?: string
  requiredRank?: string
  requiredSkill?: number
  limit?: number
  offset?: number
}

export async function getCraftsFromDB(
  filters: GetCraftsQuery,
  limit: number,
  offset: number
) {
  try {
    const totalCount = await db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(craft)
      .where(
        and(
          filters.itemId
            ? like(craft.itemId, `%${filters.itemId}%`)
            : undefined,
          filters.professionId
            ? eq(craft.professionId, filters.professionId)
            : undefined,
          filters.requiredRank
            ? eq(craft.requiredRank, filters.requiredRank)
            : undefined,
          filters.requiredSkill
            ? eq(craft.requiredSkill, filters.requiredSkill)
            : undefined
        )
      )
    const totalRecords = Number(totalCount[0]?.count) || 0

    const query = db
      .select({
        craftId: craft.craftId,
        itemId: craft.itemId,
        professionId: craft.professionId,
        requiredRank: craft.requiredRank,
        requiredSkill: craft.requiredSkill,
        producedQuantity: craft.producedQuantity,
        creationTime: craft.creationTime,
        createdAt: craft.createdAt,
        updatedAt: craft.updatedAt,
      })
      .from(craft)
    const conditions = []

    if (filters.itemId) {
      conditions.push(eq(craft.itemId, filters.itemId))
    }
    if (filters.professionId) {
      conditions.push(eq(craft.professionId, filters.professionId))
    }
    if (filters.requiredRank) {
      conditions.push(eq(craft.requiredRank, filters.requiredRank))
    }
    if (filters.requiredSkill || filters.requiredSkill === 0) {
      conditions.push(eq(craft.requiredSkill, filters.requiredSkill))
    }

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }
    query.limit(limit).offset(offset)

    const craftResult = await query
    return { craftResult, totalRecords }
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch craft from the database')
  }
}

export async function insertCraftsIntoDB(craftData: PostCraftsBody) {
  try {
    await db.insert(craft).values({
      itemId: craftData.itemId,
      professionId: craftData.professionId,
      requiredRank: craftData.requiredRank,
      requiredSkill: craftData.requiredSkill,
      producedQuantity: craftData.producedQuantity,
      creationTime: craftData.creationTime,
    })
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function getCountCrafts(craftParams: CraftsParams) {
  try {
    const query = db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(craft)
      .where(eq(craft.craftId, craftParams.craftId))
    const resultCountCrafts = await query
    const result = Number(resultCountCrafts[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch category from the database')
  }
}

export async function updateCraftsSetDB(
  craftData: PutCraftsBody,
  craftParams: CraftsParams
) {
  try {
    await db
      .update(craft)
      .set({
        itemId: craftData.itemId,
        professionId: craftData.professionId,
        requiredRank: craftData.requiredRank,
        requiredSkill: craftData.requiredSkill,
        producedQuantity: craftData.producedQuantity,
        creationTime: craftData.creationTime,
        updatedAt: new Date(),
      })
      .where(eq(craft.craftId, craftParams.craftId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteCraftsInDB(craftParams: CraftsParams) {
  try {
    await db.delete(craft).where(eq(craft.craftId, craftParams.craftId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
