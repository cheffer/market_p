import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  deleteDepentenciesItemsService,
  deleteItemsService,
  getItemsService,
  postDependenciesItemsService,
  putFavoriteItemService,
  postItemsService,
  putItemsService,
} from '../services/itemsService'
import {
  dependenciesItemsQuerySchema,
  dependenciesItemsBodySchema,
  favoriteItemsBodySchema,
  getItemsQuerySchema,
  itemsParamsSchema,
  postItemsBodySchema,
  putItemsBodySchema,
} from '../schemas/itemsSchemas'
import type {
  DependenciesItemsBody,
  DependenciesItemsQuery,
  FavoriteItemsBody,
  GetItemsQuery,
  ItemsParams,
  PostItemsBody,
  PutItemsBody,
} from '../schemas/types'

export const itemsController: FastifyPluginAsync = async app => {
  // Rota para GET /items
  app.get(
    '/items',
    { schema: { querystring: getItemsQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetItemsQuery }>,
      reply: FastifyReply
    ) => {
      const { name, categoryId, favorite, limit, offset } = request.query
      const favoriteBoolean =
        favorite === 'true' ? true : favorite === 'false' ? false : undefined
      try {
        const { items, pagination } = await getItemsService(
          {
            name,
            categoryId,
            favorite: favoriteBoolean,
          },
          limit,
          offset,
          reply
        )
        reply.status(200).send({ items, pagination })
      } catch (error) {
        // Logando erro
        request.log.error(
          `Error when searching for item with name: ${name}`,
          error
        )
        throw error // O middleware de erros lidará com o erro
      }
    }
  )

  // Rota para POST /items
  app.post(
    '/items',
    { schema: { body: postItemsBodySchema } },
    async (
      request: FastifyRequest<{ Body: PostItemsBody }>,
      reply: FastifyReply
    ) => {
      const itemData = request.body
      try {
        const resultPostItems = await postItemsService(itemData)
        reply.status(201).send(resultPostItems)
      } catch (error) {
        request.log.error('Error creating item', error)
        throw error
      }
    }
  )

  // Rota para PUT /items/:{itemID}
  app.put(
    '/items/:itemId',
    {
      schema: {
        body: putItemsBodySchema,
        params: itemsParamsSchema,
      },
    },
    async (
      request: FastifyRequest<{ Body: PutItemsBody; Params: ItemsParams }>,
      reply: FastifyReply
    ) => {
      const itemData = request.body
      const itemParams = request.params
      try {
        const resultPutItems = await putItemsService(itemData, itemParams)
        reply.status(200).send(resultPutItems)
      } catch (error) {
        request.log.error(
          `Error updating item with ID: ${itemParams.itemId}`,
          error
        )
        throw error
      }
    }
  )

  // Rota para DELETE /items/:{itemID}
  app.delete(
    '/items/:itemId',
    { schema: { params: itemsParamsSchema } },
    async (
      request: FastifyRequest<{ Params: ItemsParams }>,
      reply: FastifyReply
    ) => {
      const itemParams = request.params
      try {
        await deleteItemsService(itemParams)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting item with ID: ${itemParams.itemId}`,
          error
        )
        throw error
      }
    }
  )

  // Rota para PUT favorito /items/:{itemID}/favorite
  app.put(
    '/items/:itemId/favorite',
    {
      schema: {
        params: itemsParamsSchema,
        body: favoriteItemsBodySchema,
      },
    },
    async (
      request: FastifyRequest<{ Params: ItemsParams; Body: FavoriteItemsBody }>,
      reply: FastifyReply
    ) => {
      const itemParams = request.params
      const favoriteItemBody = request.body
      try {
        const resultPutItemsFavorite = await putFavoriteItemService(
          itemParams,
          favoriteItemBody
        )
        reply.status(200).send(resultPutItemsFavorite.result)
      } catch (error) {
        request.log.error(
          `Error updating favorite item with ID: ${itemParams.itemId}`,
          error
        )
        throw error
      }
    }
  )

  // Rota para POST dependencies /items/:{itemID}/dependencies
  app.post(
    '/items/:itemId/dependencies',
    {
      schema: {
        params: itemsParamsSchema,
        body: dependenciesItemsBodySchema,
      },
    },
    async (
      request: FastifyRequest<{
        Params: ItemsParams
        Body: DependenciesItemsBody
      }>,
      reply: FastifyReply
    ) => {
      const itemParams = request.params
      const dependenciesItemsBody = request.body
      try {
        const resultPostDependenciesItems = await postDependenciesItemsService(
          itemParams,
          dependenciesItemsBody
        )
        reply.status(201).send(resultPostDependenciesItems)
      } catch (error) {
        request.log.error('Error creating dependent item', error)
        throw error
      }
    }
  )

  // Rota para DELETE dependencies /items/:{itemID}/dependencies
  app.delete(
    '/items/:itemId/dependencies',
    {
      schema: {
        params: itemsParamsSchema,
        querystring: dependenciesItemsQuerySchema,
      },
    },
    async (
      request: FastifyRequest<{
        Params: ItemsParams
        Querystring: DependenciesItemsQuery
      }>,
      reply: FastifyReply
    ) => {
      const itemParams = request.params
      const itemData = request.query
      try {
        await deleteDepentenciesItemsService(itemParams, itemData)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting item with ID: ${itemParams.itemId}`,
          error
        )
        throw error
      }
    }
  )
}
