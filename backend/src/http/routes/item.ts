import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getItems } from '../../functions/item'
import z from 'zod'

const getItemsQuerySchema = z.object({
  name: z.string().optional(),
  categoryFilter: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

interface GetItemsQuery {
  name?: string
  categoryFilter?: string
  favorite?: string
  limit?: number
  offset?: number
}

export const getItemsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/items',
    {
      schema: { querystring: getItemsQuerySchema },
    },
    async request => {
      try {
        const { name, categoryFilter, favorite, limit, offset } =
          request.query as GetItemsQuery
        const favoriteBoolean =
          favorite === 'true' ? true : favorite === 'false' ? false : undefined

        const { Items } = await getItems({
          name,
          categoryFilter,
          favorite: favoriteBoolean,
          limit,
          offset,
        })
        return { Items }
      } catch (error) {
        console.error(error)
        return { error: 'An error occurred while fetching items' }
      }
    }
  )
}
