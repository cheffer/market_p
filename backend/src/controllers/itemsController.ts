import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  deleteItemsService,
  getItemsService,
  postItemsService,
  putItemsService,
} from '../services/itemsService'
import {
  deleteItemsQuerySchemaParams,
  getItemsQuerySchema,
  postItemsQuerySchema,
  putItemsQuerySchemaBody,
  putItemsQuerySchemaParams,
} from '../schemas/itemsSchemas'
import type {
  DeleteItemsParams,
  GetItemsQuery,
  PostItemsBody,
  PutItemsBody,
  PutItemsParams,
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
          details: (error as Error).message,
        })
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
        reply.status(400).send({
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
        body: putItemsQuerySchemaBody,
        params: putItemsQuerySchemaParams,
      },
    },
    async (
      request: FastifyRequest<{ Body: PutItemsBody; Params: PutItemsParams }>,
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
    { schema: { params: deleteItemsQuerySchemaParams } },
    async (
      request: FastifyRequest<{ Params: DeleteItemsParams }>,
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
}
