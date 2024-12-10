import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'
import { category } from '../db/schema'
import type {
  CategoriesParams,
  ErrorHandlerType,
  PostCategoriesBody,
  PutCategoriesBody,
} from '../schemas/types'

export async function getCategoriesFromDB() {
  try {
    const result = await db
      .select({
        categoryId: category.categoryId,
        name: category.name,
        description: category.description,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })
      .from(category)
      .orderBy(category.name)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch category from the database')
  }
}

export async function insertCategoriesIntoDB(categoryData: PostCategoriesBody) {
  try {
    await db.insert(category).values({
      name: categoryData.name,
      description: categoryData.description,
    })
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function getCountCategories(categoryParams: CategoriesParams) {
  try {
    const query = db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(category)
      .where(eq(category.categoryId, categoryParams.categoryId))
    const resultCountCategories = await query
    const result = Number(resultCountCategories[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch category from the database')
  }
}

export async function updateCategorySetDB(
  categoryData: PutCategoriesBody,
  categoryParams: CategoriesParams
) {
  try {
    await db
      .update(category)
      .set({
        name: categoryData.name,
        description: categoryData.description,
        updatedAt: new Date(),
      })
      .where(eq(category.categoryId, categoryParams.categoryId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteCategoryInDB(categoriesParams: CategoriesParams) {
  try {
    await db
      .delete(category)
      .where(eq(category.categoryId, categoriesParams.categoryId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
