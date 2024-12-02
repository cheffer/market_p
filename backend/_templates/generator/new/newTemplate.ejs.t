---
to: _templates/<%= name %>/<%= action || 'new' %>/<%= name %>.ejs.t
---
---
to: src/<%= type %>/TROCAR<%= Name %>.ts
---
//controller//
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  deleteTROCARService,
  getTROCARService,
  postTROCARService,
  putTROCARService,
} from '../services/TROCARService'
import {
  TROCARQuerySchema,
  TROCARBodySchema,
  TROCARParamsSchema,
} from '../schemas/TROCARSchemas'
import type {
  TROCARBody,
  GetTROCARQuery,
  TROCARParams,
  PostTROCARBody,
  PutTROCARBody,
} from '../schemas/types'

export const TROCARController: FastifyPluginAsync = async app => {
  // Rota para GET /TROCAR
  app.get(
    '/TROCAR',
    { schema: { querystring: getTROCARQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetTROCARQuery }>,
      reply: FastifyReply
    ) => {
      const { ?, limit, offset } = request.query
      const favoriteBoolean =
        favorite === 'true' ? true : favorite === 'false' ? false : undefined
      try {
        const { TROCAR, pagination } = await getTROCARService(
          {
            ?
          },
          limit,
          offset,
          reply
        )
        reply.status(200).send({ TROCAR, pagination })
      } catch (error) {
        // Logando erro
        request.log.error(
          `Error when searching for item with name: ${name}`,
          error
        )
      }
    }
  )
}

//repository//
import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { ? } from '../db/schema'
import type {
  ErrorHandlerType,
  TROCARParams,
  PostTROCARBody,
  PutITROCARBody,
} from '../schemas/types'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'

interface GetTROCARQuery {
  name?: string
  categoryId?: string
  favorite?: boolean
  limit?: number
  offset?: number
}


//service//
import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import {
  deleteTROCARInDB,
  getTROCARFromDB,
  insertTROCARIntoDB,
  updateTROCARSetDB,
} from '../repositories/itemsRepository'
import type {
  ErrorHandlerType,
  TROCARParams,
  PostTROCARBody,
  PutTROCARBody,
} from '../schemas/types'
import type { FastifyReply } from 'fastify'

interface GetTROCARQuery {
  name?: string
  categoryId?: string
  favorite?: boolean
  limit?: number
  offset?: number
}


//schema//
import z from 'zod'

// Schema para consulta de TROCAR (GET /TROCAR)
export const getTROCARQuerySchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})
