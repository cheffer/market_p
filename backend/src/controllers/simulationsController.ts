import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  getSimulationsQuerySchema,
  postSimulationsBodySchema,
  putSimulationsBodySchema,
  simulationsParams,
} from '../schemas/simulationsSchemas'
import type {
  GetSimulationsQuery,
  PostSimulationsBody,
  PutSimulationsBody,
  SimulationsParams,
} from '../schemas/types'
import {
  deleteSimulationsService,
  getSimulationsService,
  postSimulationsService,
  putSimulationsService,
} from '../services/simulationsService'

export const simulationsController: FastifyPluginAsync = async app => {
  // Route from get simulation
  app.get(
    '/simulations',
    { schema: { querystring: getSimulationsQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetSimulationsQuery }>,
      reply: FastifyReply
    ) => {
      const { itemId, limit, offset } = request.query
      try {
        const { simulationsResult, pagination } = await getSimulationsService({
          itemId,
          limit,
          offset,
        })
        reply.status(200).send({ simulationsResult, pagination })
      } catch (error) {
        request.log.error('Error when searching simulations', error)
        throw error
      }
    }
  )

  // Route from post simulation
  app.post(
    '/simulations',
    { schema: { body: postSimulationsBodySchema } },
    async (
      request: FastifyRequest<{ Body: PostSimulationsBody }>,
      reply: FastifyReply
    ) => {
      const simulationData = request.body
      try {
        await postSimulationsService(simulationData)
        reply.status(201).send('simulation created successfully')
      } catch (error) {
        request.log.error('Error creating simulation', error)
        throw error
      }
    }
  )

  // Route from put simulation
  app.put(
    '/simulations/:simulationId',
    { schema: { body: putSimulationsBodySchema, params: simulationsParams } },
    async (
      request: FastifyRequest<{
        Body: PutSimulationsBody
        Params: SimulationsParams
      }>,
      reply: FastifyReply
    ) => {
      const simulationData = request.body
      const simulationParams = request.params
      try {
        await putSimulationsService(simulationData, simulationParams)
        reply.status(200).send('simulation updated successfully')
      } catch (error) {
        request.log.error(
          `Error updating simulation with ID: ${simulationParams.simulationId}`,
          error
        )
        throw error
      }
    }
  )

  // Route from delete simulation
  app.delete(
    '/simulations/:simulationId',
    { schema: { params: simulationsParams } },
    async (
      request: FastifyRequest<{ Params: SimulationsParams }>,
      reply: FastifyReply
    ) => {
      const simulationParams = request.params
      try {
        await deleteSimulationsService(simulationParams)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting simulation with ID: ${simulationParams.simulationId}`,
          error
        )
        throw error
      }
    }
  )
}
