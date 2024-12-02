---
to: src/repositories/<%= name %>Repository.ts
---
import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { ? } from '../db/schema'
import type {
  ErrorHandlerType,
  <%= name %>Params,
  Post<%= Name %>Body,
  PutI<%= Name %>Body,
} from '../schemas/types'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'

interface Get<%= Name %>Query {
  name?: string
  categoryId?: string
  favorite?: boolean
  limit?: number
  offset?: number
}