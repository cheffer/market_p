import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  deleteDepentenciesItemsService,
  deleteItemsService,
  getItemsService,
  postDependenciesItemsService,
  postItemsFavoriteService,
  postItemsService,
  putItemsService,
} from '../services/itemsService'
import {
  dependeciesItemsQuerySchema,
  dependeciesItemsBodySchema,
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
        if (items.length > 0) {
          reply.status(200).send({ items, pagination })
        } else {
          const message = 'The requested resource was not found.'
          reply
            .status(404)
            .send({ error: 'Unable to search', details: message })
        }
      } catch (error) {
        console.error(error)
        const message = (error as Error).message || 'Unknown error'
        reply
          .status(400)
          .send({ error: 'Error when searching for items', details: message })
        reply.status(500).send({
          error: 'Internal Server Error',
          details: message,
        })
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
        const itemFilter = { name: itemData.name }
        const result = await getItemsService(itemFilter, 1, 0)
        if (result.items.length > 0) {
          const message = 'An item with that name already exists'
          reply
            .status(409)
            .send({ error: 'Unable to create', details: message })
        } else {
          const resultInsert = (await postItemsService(itemData)).resultItem
            .result.Items
          reply.status(201).send(resultInsert)
        }
      } catch (error) {
        console.error(error)
        const message = (error as Error).message || 'Unknown error'
        reply
          .status(400)
          .send({ error: 'Error inserting item', details: message })
        reply.status(500).send({
          error: 'Error inserting item',
          details: (error as Error).message,
        })
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
      const itemParam = request.params

      try {
        const result = (await putItemsService(itemData, itemParam)).result
        if (result.length > 0) {
          const itemFilter = { name: itemData.name }
          const resultUpdate = await getItemsService(itemFilter, 1, 0)

          reply.status(200).send(resultUpdate)
        } else {
          const message = 'Item does not exist or was not reported'
          reply
            .status(404)
            .send({ error: 'Unable to update', details: message })
        }
      } catch (error) {
        reply.status(400).send({
          error: 'Error updating item',
          details: (error as Error).message,
        })
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
      const itemParam = request.params
      try {
        const result = await deleteItemsService(itemParam)
        if (result.length > 0) {
          //reply.status(204).send()
          reply
            .status(200)
            .send({ message: `Item '${result[0].name}' has been deleted.` })
        } else {
          const message = 'Item does not exist or was not reported'
          reply
            .status(404)
            .send({ error: 'Unable to delete', details: message })
        }
      } catch (error) {
        console.error(error)
        const message = (error as Error).message || 'Unknown error'
        reply.status(400).send({ error: 'Error delete item', details: message })
      }
    }
  )

  // Rota para POST favorito /items/:{itemID}/favorite
  app.post(
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
        const result = await postItemsFavoriteService(
          itemParams,
          favoriteItemBody
        )
        if (result.result.length > 0) {
          reply.status(200).send(result.result)
        } else {
          const message = 'Item does not exist or was not reported'
          reply
            .status(404)
            .send({ error: 'Unable to favorite', details: message })
        }
      } catch (error) {
        {
          console.error(error)
          const message = (error as Error).message || 'Unknown error'
          reply
            .status(400)
            .send({ error: 'Error inserting item', details: message })
          reply.status(500).send({
            error: 'Error inserting item',
            details: (error as Error).message,
          })
        }
      }
    }
  )

  // Rota para POST dependencies /items/:{itemID}/dependencies
  app.post(
    '/items/:itemId/dependencies',
    {
      schema: {
        params: itemsParamsSchema,
        body: dependeciesItemsBodySchema,
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
      const dependeciesItemsBody = request.body
      try {
        const result = await postDependenciesItemsService(
          itemParams,
          dependeciesItemsBody
        )
        reply.status(201).send(result)
      } catch (error) {
        {
          console.error(error)
          const message = (error as Error).message || 'Unknown error'
          reply
            .status(400)
            .send({ error: 'Error inserting item', details: message })
          reply.status(500).send({
            error: 'Error inserting item',
            details: (error as Error).message,
          })
        }
      }
    }
  )

  // Rota para DELETE dependencies /items/:{itemID}/dependencies
  app.delete(
    '/items/:itemId/dependencies',
    {
      schema: {
        params: itemsParamsSchema,
        querystring: dependeciesItemsQuerySchema,
      },
    },
    async (
      request: FastifyRequest<{
        Params: ItemsParams
        Querystring: DependenciesItemsQuery
      }>,
      reply: FastifyReply
    ) => {
      const itemParam = request.params
      const itemData = request.query
      try {
        const result = await deleteDepentenciesItemsService(itemParam, itemData)
        if (result.result.length > 0) {
          reply
            .status(200)
            .send({ message: `Item '${result}' has been deleted.` })
        } else {
          const message = 'Item does not exist or was not reported'
          reply
            .status(404)
            .send({ error: 'Unable to delete', details: message })
        }
      } catch (error) {
        console.error(error)
        const message = (error as Error).message || 'Unknown error'
        reply
          .status(400)
          .send({ error: 'Error delete dependent item', details: message })
      }
    }
  )
}
