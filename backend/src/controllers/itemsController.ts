import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { getItemsService, postItemsService } from '../services/itemsService'
import {
  getItemsQuerySchema,
  postItemsQuerySchema,
} from '../schemas/itemsSchemas'
import type { z } from 'zod'

// Inferir os tipos a partir dos esquemas Zod
type GetItemsQuery = z.infer<typeof getItemsQuerySchema>
type PostItemsBody = z.infer<typeof postItemsQuerySchema>

export const itemsController: FastifyPluginAsync = async app => {
  // Rota para GET /items
  app.get(
    '/items',
    { schema: { querystring: getItemsQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetItemsQuery }>,
      reply: FastifyReply
    ) => {
      try {
        const { name, categoryId, favorite, limit, offset } = request.query
        const favoriteBoolean =
          favorite === 'true' ? true : favorite === 'false' ? false : undefined

        const { items, pagination } = await getItemsService(
          {
            name,
            categoryId,
            favorite: favoriteBoolean,
          },
          limit,
          offset
        )

        reply.send({ items, pagination })
      } catch (error) {
        console.error(error)
        const message = (error as Error).message || 'Unknown error'
        reply
          .status(400)
          .send({ error: 'Error when searching for items', details: message })
      }
    }
  )

  // Rota para POST /items
  app.post(
    '/items',
    { schema: { body: postItemsQuerySchema } },
    async (
      request: FastifyRequest<{ Body: PostItemsBody }>,
      reply: FastifyReply
    ) => {
      try {
        const itemData = request.body
        const result = await postItemsService(itemData)
        reply.send(result)
      } catch (error) {
        console.error(error)
        const message = (error as Error).message || 'Unknown error'
        reply
          .status(400)
          .send({ error: 'Error inserting item', details: message })
      }
    }
  )
}
