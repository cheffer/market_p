import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getItems } from '../../functions/item'

interface GetItemsQuery {
  name?: string
  categoryFilter?: string
  favorite?: string
}

export const getItemsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/items', async request => {
    const { name, categoryFilter, favorite } = request.query as GetItemsQuery
    const favoriteBoolean =
      favorite === 'true' ? true : favorite === 'false' ? false : undefined
    const { Items } = await getItems({
      name,
      categoryFilter,
      favorite: favoriteBoolean,
    })
    return { Items }
  })
}
