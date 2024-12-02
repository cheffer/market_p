import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import {
  deleteCategoriesInDB,
  getCategoriesFromDB,
  insertCategoriesIntoDB,
  updateCategoriesSetDB,
} from '../repositories/itemsRepository'
import type {
  ErrorHandlerType,
  categoriesParams,
  PostCategoriesBody,
  PutCategoriesBody,
} from '../schemas/types'
import type { FastifyReply } from 'fastify'

interface GetCategoriesQuery {
  name?: string
  categoryId?: string
  favorite?: boolean
  limit?: number
  offset?: number
}