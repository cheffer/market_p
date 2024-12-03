---
to: _templates/<%= name %>/<%= action || 'new' %>/<%= name %>.ejs.t
---
---
to: src/<%= type %>/TROCAR<%= Name %>.ts
---
//controller//
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'

export const TROCARController: FastifyPluginAsync = async app => {
}

//repository//
import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'

//service//
import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import type { FastifyReply } from 'fastify'

//schema//
import z from 'zod'

