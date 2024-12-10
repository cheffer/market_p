import { handleDatabaseError, NotFoundError } from '../errors/customErrors'
import {
  deleteCategoryInDB,
  getCategoriesFromDB,
  getCountCategories,
  insertCategoriesIntoDB,
  updateCategorySetDB,
} from '../repositories/categoriesRepository'
import type {
  CategoriesParams,
  ErrorHandlerType,
  PostCategoriesBody,
  PutCategoriesBody,
} from '../schemas/types'

export async function getCategoriesService() {
  const resultGetCategories = await getCategoriesFromDB()
  return resultGetCategories
}

export async function postCategoriesService(categoryData: PostCategoriesBody) {
  try {
    await insertCategoriesIntoDB(categoryData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function putCategoriesService(
  categoryData: PutCategoriesBody,
  categoryParams: CategoriesParams
) {
  try {
    const resultCountCategory = await getCountCategories(categoryParams)
    if (resultCountCategory === 0) {
      throw new NotFoundError('Category not found')
    }
    await updateCategorySetDB(categoryData, categoryParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteCategoriesService(
  categoryParams: CategoriesParams
) {
  try {
    const resultCountCategory = await getCountCategories(categoryParams)
    if (resultCountCategory === 0) {
      throw new NotFoundError('Category not found')
    }
    await deleteCategoryInDB(categoryParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
