import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  deleteCategoriesService,
  getCategoriesService,
  postCategoriesService,
  putCategoriesService,
} from '../services/categoriesService'
import {
  categoriesQuerySchema,
  categoriesBodySchema,
  categoriesParamsSchema,
} from '../schemas/categoriesSchemas'
import type {
  categoriesBody,
  GetCategoriesQuery,
  categoriesParams,
  PostCategoriesBody,
  PutCategoriesBody,
} from '../schemas/types'

export const categoriesController: FastifyPluginAsync = async app => {
  // Rota para GET /categories
  app.get(
    '/categories',
    { schema: { querystring: getCategoriesQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetCategoriesQuery }>,
      reply: FastifyReply
    ) => {
      const { ?, limit, offset } = request.query
      const favoriteBoolean =
        favorite === 'true' ? true : favorite === 'false' ? false : undefined
      try {
        const { categories, pagination } = await getCategoriesService(
          {
            ?
          },
          limit,
          offset,
          reply
        )
        reply.status(200).send({ categories, pagination })
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