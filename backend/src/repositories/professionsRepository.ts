import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'
import { profession } from '../db/schema'
import type {
  ErrorHandlerType,
  GetProfessionsQuery,
  InputProfessionsBody,
  ProfessionsParams,
} from '../schemas/types'

export async function getProfessionsFromDB(filters: GetProfessionsQuery) {
  try {
    const query = db
      .select({
        professionId: profession.professionId,
        name: profession.name,
        specialization: profession.specialization,
        rank: profession.rank,
        skill: profession.skill,
        createdAt: profession.createdAt,
        updatedAt: profession.updatedAt,
      })
      .from(profession)

    const conditions = []

    if (filters.name) {
      conditions.push(
        eq(sql`LOWER(${profession.name})`, sql`LOWER(${filters.name})`)
      )
    }
    if (filters.specialization) {
      conditions.push(
        eq(
          sql`LOWER(${profession.specialization})`,
          sql`LOWER(${filters.specialization})`
        )
      )
    }
    if (filters.rank) {
      conditions.push(
        eq(sql`LOWER(${profession.rank})`, sql`LOWER(${filters.rank})`)
      )
    }

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    const professionResult = await query
    return professionResult
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch profession from the database')
  }
}

export async function insertProfessionsIntoDB(
  professionData: InputProfessionsBody
) {
  try {
    await db.insert(profession).values({
      name: professionData.name,
      specialization: professionData.specialization,
      rank: professionData.rank,
      skill: professionData.skill,
    })
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function getCountProfessions(professionParams: ProfessionsParams) {
  try {
    const query = db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(profession)
      .where(eq(profession.professionId, professionParams.professionId))
    const resultCountProfessions = await query
    const result = Number(resultCountProfessions[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch profession from the database')
  }
}

export async function updateProfessionsSetDB(
  professionData: InputProfessionsBody,
  professionParams: ProfessionsParams
) {
  try {
    await db
      .update(profession)
      .set({
        name: professionData.name,
        specialization: professionData.specialization,
        rank: professionData.rank,
        skill: professionData.skill,
        updatedAt: new Date(),
      })
      .where(eq(profession.professionId, professionParams.professionId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteProfessionsInDB(
  professionParams: ProfessionsParams
) {
  try {
    await db
      .delete(profession)
      .where(eq(profession.professionId, professionParams.professionId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
