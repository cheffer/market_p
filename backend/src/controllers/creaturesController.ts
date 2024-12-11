import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  creaturesParams,
  getCreaturesQuerySchema,
  postCreaturesBodySchema,
  putCreaturesBodySchema,
} from '../schemas/creaturesSchemas'
import type {
  CreaturesParams,
  GetCreaturesQuery,
  PostCreaturesBody,
  PutCreaturesBody,
} from '../schemas/types'
import {
  deleteCreaturesService,
  getCreaturesService,
  postCreaturesService,
  putCreaturesService,
} from '../services/creaturesService'

export const creaturesController: FastifyPluginAsync = async app => {
  // Route from get creatures
  app.get(
    '/creatures',
    { schema: { querystring: getCreaturesQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetCreaturesQuery }>,
      reply: FastifyReply
    ) => {
      const { name, type, location, limit, offset } = request.query
      try {
        const { creatures, pagination } = await getCreaturesService(
          { name, type, location },
          limit,
          offset
        )
        reply.status(200).send({ creatures, pagination })
      } catch (error) {
        request.log.error('Error when searching creature', error)
        throw error
      }
    }
  )

  // Route from post creatures
  app.post(
    '/creatures',
    { schema: { body: postCreaturesBodySchema } },
    async (
      request: FastifyRequest<{ Body: PostCreaturesBody }>,
      reply: FastifyReply
    ) => {
      const creatureData = request.body
      try {
        await postCreaturesService(creatureData)
        reply.status(201).send('Creature created successfully')
      } catch (error) {
        request.log.error('Error creating creature', error)
        throw error
      }
    }
  )

  // Route from put creature
  app.put(
    '/creatures/:creatureId',
    { schema: { body: putCreaturesBodySchema, params: creaturesParams } },
    async (
      request: FastifyRequest<{
        Body: PutCreaturesBody
        Params: CreaturesParams
      }>,
      reply: FastifyReply
    ) => {
      const creatureData = request.body
      const creatureParams = request.params
      try {
        await putCreaturesService(creatureData, creatureParams)
        reply.status(200).send('Creature updated successfully')
      } catch (error) {
        request.log.error(
          `Error updating creature with ID: ${creatureParams.creatureId}`,
          error
        )
        throw error
      }
    }
  )

  // Route from delete creature
  app.delete(
    '/creatures/:creatureId',
    { schema: { params: creaturesParams } },
    async (
      request: FastifyRequest<{ Params: CreaturesParams }>,
      reply: FastifyReply
    ) => {
      const creatureParams = request.params
      try {
        await deleteCreaturesService(creatureParams)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting creature with ID: ${creatureParams.creatureId}`,
          error
        )
        throw error
      }
    }
  )
}
