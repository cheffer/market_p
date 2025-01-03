import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  getProfessionsQuerySchema,
  inputProfessionsBodySchema,
  professionsParams,
} from '../schemas/professionsSchemas'
import type {
  GetProfessionsQuery,
  InputProfessionsBody,
  ProfessionsParams,
} from '../schemas/types'
import {
  deleteProfessionsService,
  getProfessionsService,
  postProfessionsService,
  putProfessionsService,
} from '../services/professionsService'

export const professionsController: FastifyPluginAsync = async app => {
  // Route from get profession
  app.get(
    '/professions',
    { schema: { querystring: getProfessionsQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetProfessionsQuery }>,
      reply: FastifyReply
    ) => {
      const { name, specialization, rank } = request.query
      try {
        const professions = await getProfessionsService({
          name,
          specialization,
          rank,
        })
        reply.status(200).send(professions)
      } catch (error) {
        request.log.error('Error when searching profession', error)
        throw error
      }
    }
  )

  // Route from post profession
  app.post(
    '/professions',
    { schema: { body: inputProfessionsBodySchema } },
    async (
      request: FastifyRequest<{ Body: InputProfessionsBody }>,
      reply: FastifyReply
    ) => {
      const professionData = request.body
      try {
        await postProfessionsService(professionData)
        reply.status(201).send('Profession created successfully')
      } catch (error) {
        request.log.error('Error creating profession', error)
        throw error
      }
    }
  )

  // Route from put profession
  app.put(
    '/professions/:professionId',
    { schema: { body: inputProfessionsBodySchema, params: professionsParams } },
    async (
      request: FastifyRequest<{
        Body: InputProfessionsBody
        Params: ProfessionsParams
      }>,
      reply: FastifyReply
    ) => {
      const professionData = request.body
      const professionParams = request.params
      try {
        await putProfessionsService(professionData, professionParams)
        reply.status(200).send('Profession updated successfully')
      } catch (error) {
        request.log.error(
          `Error updating profession with ID: ${professionParams.professionId}`,
          error
        )
        throw error
      }
    }
  )

  // Route from delete profession
  app.delete(
    '/professions/:professionId',
    { schema: { params: professionsParams } },
    async (
      request: FastifyRequest<{ Params: ProfessionsParams }>,
      reply: FastifyReply
    ) => {
      const professionParams = request.params
      try {
        await deleteProfessionsService(professionParams)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting profession with ID: ${professionParams.professionId}`,
          error
        )
        throw error
      }
    }
  )
}
