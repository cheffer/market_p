import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getListItems } from '../../functions/get-list-items'

export const getListItemRoutes: FastifyPluginAsyncZod = async app => {
  app.get('/list-item', async () => {
    const { listItems } = await getListItems()
    return { listItems }
  })
}
