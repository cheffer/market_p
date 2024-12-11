import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'
import type {
  CreaturesParams,
  ErrorHandlerType,
  PostCreaturesBody,
  PutCreaturesBody,
} from '../schemas/types'
import { creature } from '../db/schema'

interface GetCreaturesQuery {
  name?: string
  type?: string
  location?: string
  limit?: number
  offset?: number
}

export async function getCreaturesFromDB(
  filters: GetCreaturesQuery,
  limit: number,
  offset: number
) {
  try {
    const totalCount = await db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(creature)
      .where(
        and(
          filters.name ? like(creature.name, `%${filters.name}%`) : undefined,
          filters.type ? eq(creature.type, filters.type) : undefined,
          filters.location ? eq(creature.location, filters.location) : undefined
        )
      )
    const totalRecords = Number(totalCount[0]?.count) || 0
    const query = db
      .select({
        creatureId: creature.creatureId,
        name: creature.name,
        type: creature.type,
        location: creature.location,
        createdAt: creature.createdAt,
        updatedAt: creature.updatedAt,
      })
      .from(creature)

    const conditions = []

    if (filters.name) {
      conditions.push(eq(creature.name, filters.name))
    }
    if (filters.type) {
      conditions.push(eq(creature.type, filters.type))
    }
    if (filters.location) {
      conditions.push(eq(creature.location, filters.location))
    }

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }
    query.limit(limit).offset(offset)

    const creatureResult = await query
    return { creatureResult, totalRecords }
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch creature from the database')
  }
}

export async function insertCreaturesIntoDB(creatureData: PostCreaturesBody) {
  try {
    await db.insert(creature).values({
      name: creatureData.name,
      type: creatureData.type,
      location: creatureData.location,
    })
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function getCountCreatures(creaturesParams: CreaturesParams) {
  try {
    const query = db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(creature)
      .where(eq(creature.creatureId, creaturesParams.creatureId))
    const resultCountCreatures = await query
    const result = Number(resultCountCreatures[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch creature from the database')
  }
}

export async function updateCreaturesSetDB(
  creatureData: PutCreaturesBody,
  creatureParams: CreaturesParams
) {
  try {
    await db
      .update(creature)
      .set({
        name: creatureData.name,
        type: creatureData.type,
        location: creatureData.location,
        updatedAt: new Date(),
      })
      .where(eq(creature.creatureId, creatureParams.creatureId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteCreaturesInDB(creatureParams: CreaturesParams) {
  try {
    await db
      .delete(creature)
      .where(eq(creature.creatureId, creatureParams.creatureId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
