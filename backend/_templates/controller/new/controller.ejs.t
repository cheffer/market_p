---
to: src/controllers/<%= name %>Controller.ts
---
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  delete<%= Name %>Service,
  get<%= Name %>Service,
  post<%= Name %>Service,
  put<%= Name %>Service,
} from '../services/<%= name %>Service'
import {
  <%= name %>QuerySchema,
  <%= name %>BodySchema,
  <%= name %>ParamsSchema,
} from '../schemas/<%= name %>Schemas'
import type {
  <%= name %>Body,
  Get<%= Name %>Query,
  <%= name %>Params,
  Post<%= Name %>Body,
  Put<%= Name %>Body,
} from '../schemas/types'

export const <%= name %>Controller: FastifyPluginAsync = async app => {
  // Rota para GET /<%= name %>
  app.get(
    '/<%= name %>',
    { schema: { querystring: get<%= Name %>QuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: Get<%= Name %>Query }>,
      reply: FastifyReply
    ) => {
      const { ?, limit, offset } = request.query
      const favoriteBoolean =
        favorite === 'true' ? true : favorite === 'false' ? false : undefined
      try {
        const { <%= name %>, pagination } = await get<%= Name %>Service(
          {
            ?
          },
          limit,
          offset,
          reply
        )
        reply.status(200).send({ <%= name %>, pagination })
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