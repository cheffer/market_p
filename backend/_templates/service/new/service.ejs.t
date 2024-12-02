---
to: src/services/<%= name %>Service.ts
---
import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import {
  delete<%= Name %>InDB,
  get<%= Name %>FromDB,
  insert<%= Name %>IntoDB,
  update<%= Name %>SetDB,
} from '../repositories/itemsRepository'
import type {
  ErrorHandlerType,
  <%= name %>Params,
  Post<%= Name %>Body,
  Put<%= Name %>Body,
} from '../schemas/types'
import type { FastifyReply } from 'fastify'

interface Get<%= Name %>Query {
  name?: string
  categoryId?: string
  favorite?: boolean
  limit?: number
  offset?: number
}