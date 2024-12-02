import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { ? } from '../db/schema'
import type {
  ErrorHandlerType,
  categoriesParams,
  PostCategoriesBody,
  PutICategoriesBody,
} from '../schemas/types'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'

interface GetCategoriesQuery {
  name?: string
  categoryId?: string
  favorite?: boolean
  limit?: number
  offset?: number
}