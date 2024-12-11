import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  creaturesDropsParams,
  getCreaturesDropsQuerySchema,
  postCreaturesDropsBodySchema,
  putCreaturesDropsBodySchema,
} from '../schemas/creaturesDropsSchemas'
import type {
  CreaturesDropsParams,
  GetCreaturesDropsQuery,
  PostCreaturesDropsBody,
  PutCreaturesDropsBody,
} from '../schemas/types'
import {
  deleteCreaturesDropsService,
  getCreaturesDropsService,
  postCreaturesDropsService,
  putCreaturesDropsService,
} from '../services/creaturesDropsService'

export const creaturesDropsController: FastifyPluginAsync = async app => {
  // Route from get creatures/drops
  app.get(
    '/creatures/drops',
    { schema: { querystring: getCreaturesDropsQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetCreaturesDropsQuery }>,
      reply: FastifyReply
    ) => {
      const { creatureId, itemId, limit, offset } = request.query
      try {
        const { drops, pagination } = await getCreaturesDropsService(
          { creatureId, itemId },
          limit,
          offset
        )
        reply.status(200).send({ drops, pagination })
      } catch (error) {
        request.log.error('Error when searching drop', error)
        throw error
      }
    }
  )

  // Route from post creatures/drops
  app.post(
    '/creatures/drops',
    { schema: { body: postCreaturesDropsBodySchema } },
    async (
      request: FastifyRequest<{ Body: PostCreaturesDropsBody }>,
      reply: FastifyReply
    ) => {
      const creatureDropData = request.body
      try {
        await postCreaturesDropsService(creatureDropData)
        reply.status(201).send('Drop created successfully')
      } catch (error) {
        request.log.error('Error creating drop', error)
        throw error
      }
    }
  )

  // Route from put creatures/drops
  app.put(
    '/creatures/drops/:creatureDropId',
    {
      schema: {
        body: putCreaturesDropsBodySchema,
        params: creaturesDropsParams,
      },
    },
    async (
      request: FastifyRequest<{
        Body: PutCreaturesDropsBody
        Params: CreaturesDropsParams
      }>,
      reply: FastifyReply
    ) => {
      const creatureDropData = request.body
      const creatureDropParams = request.params
      try {
        await putCreaturesDropsService(creatureDropData, creatureDropParams)
        reply.status(200).send('Drop updated successfully')
      } catch (error) {
        request.log.error(
          `Error updating drop with ID: ${creatureDropParams.creatureDropId}`,
          error
        )
        throw error
      }
    }
  )

  // Route from delete creatures/drops
  app.delete(
    '/creatures/drops/:creatureDropId',
    { schema: { params: creaturesDropsParams } },
    async (
      request: FastifyRequest<{ Params: CreaturesDropsParams }>,
      reply: FastifyReply
    ) => {
      const creatureDropParams = request.params
      try {
        await deleteCreaturesDropsService(creatureDropParams)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting drop with ID: ${creatureDropParams.creatureDropId}`,
          error
        )
        throw error
      }
    }
  )
}
