import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  craftsParams,
  getCraftsQuerySchema,
  postCraftsBodySchema,
  putCraftsBodySchema,
} from '../schemas/craftsSchemas'
import {
  deleteCraftsService,
  getCraftsService,
  postCraftsService,
  putCraftsService,
} from '../services/craftsService'
import type {
  CraftsParams,
  GetCraftsQuery,
  PostCraftsBody,
  PutCraftsBody,
} from '../schemas/types'

export const craftsController: FastifyPluginAsync = async app => {
  // Route from get craft
  app.get(
    '/crafts',
    { schema: { querystring: getCraftsQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetCraftsQuery }>,
      reply: FastifyReply
    ) => {
      const {
        itemId,
        professionId,
        requiredRank,
        requiredSkill,
        limit,
        offset,
      } = request.query

      try {
        const { craft, pagination } = await getCraftsService(
          { itemId, professionId, requiredRank, requiredSkill },
          limit,
          offset
        )
        reply.status(200).send({ craft, pagination })
      } catch (error) {
        // Logando erro
        request.log.error('Error when searching categories', error)
        throw error // O middleware de erros lidará com o erro
      }
    }
  )

  // Route from post craft
  app.post(
    '/crafts',
    { schema: { body: postCraftsBodySchema } },
    async (
      request: FastifyRequest<{ Body: PostCraftsBody }>,
      reply: FastifyReply
    ) => {
      const craftData = request.body
      try {
        await postCraftsService(craftData)
        reply.status(201).send('Craft created successfully')
      } catch (error) {
        request.log.error('Error creating craft', error)
        throw error
      }
    }
  )

  // Route from put craft
  app.put(
    '/crafts/:craftId',
    { schema: { body: putCraftsBodySchema, params: craftsParams } },
    async (
      request: FastifyRequest<{ Body: PutCraftsBody; Params: CraftsParams }>,
      reply: FastifyReply
    ) => {
      const craftData = request.body
      const craftParams = request.params
      try {
        await putCraftsService(craftData, craftParams)
        reply.status(200).send('Craft updated successfully')
      } catch (error) {
        request.log.error(
          `Error updating craft with ID: ${craftParams.craftId}`,
          error
        )
        throw error
      }
    }
  )

  // Route from delete craft
  app.delete(
    '/crafts/:craftId',
    { schema: { params: craftsParams } },
    async (
      request: FastifyRequest<{ Params: CraftsParams }>,
      reply: FastifyReply
    ) => {
      const craftsParams = request.params
      try {
        await deleteCraftsService(craftsParams)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting craft with ID: ${craftsParams.craftId}`,
          error
        )
        throw error
      }
    }
  )
}
