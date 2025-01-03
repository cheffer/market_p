import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  getSalesQuerySchema,
  postSalesBodySchema,
  putSalesBodySchema,
  salesParams,
} from '../schemas/salesSchemas'
import type {
  GetSalesQuery,
  PostSalesBody,
  PutSalesBody,
  SalesParams,
} from '../schemas/types'
import {
  deleteSalesService,
  getSalesService,
  postSalesService,
  putSalesService,
} from '../services/salesService'

export const salesController: FastifyPluginAsync = async app => {
  // Route from get sale
  app.get(
    '/sales',
    { schema: { querystring: getSalesQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetSalesQuery }>,
      reply: FastifyReply
    ) => {
      const { itemId, limit, offset } = request.query
      try {
        const sales = await getSalesService({ itemId, limit, offset })
        reply.status(200).send(sales)
      } catch (error) {
        request.log.error('Error when searching sales', error)
        throw error
      }
    }
  )

  // Route from post sale
  app.post(
    '/sales',
    { schema: { body: postSalesBodySchema } },
    async (
      request: FastifyRequest<{ Body: PostSalesBody }>,
      reply: FastifyReply
    ) => {
      const saleData = request.body
      try {
        await postSalesService(saleData)
        reply.status(201).send('sale created successfully')
      } catch (error) {
        request.log.error('Error creating sale', error)
        throw error
      }
    }
  )

  // Route from put sale
  app.put(
    '/sales/:saleId',
    { schema: { body: putSalesBodySchema, params: salesParams } },
    async (
      request: FastifyRequest<{
        Body: PutSalesBody
        Params: SalesParams
      }>,
      reply: FastifyReply
    ) => {
      const saleData = request.body
      const saleParams = request.params
      try {
        await putSalesService(saleData, saleParams)
        reply.status(200).send('sale updated successfully')
      } catch (error) {
        request.log.error(
          `Error updating sale with ID: ${saleParams.saleId}`,
          error
        )
        throw error
      }
    }
  )

  // Route from delete sale
  app.delete(
    '/sales/:saleId',
    { schema: { params: salesParams } },
    async (
      request: FastifyRequest<{ Params: SalesParams }>,
      reply: FastifyReply
    ) => {
      const saleParams = request.params
      try {
        await deleteSalesService(saleParams)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting sale with ID: ${saleParams.saleId}`,
          error
        )
        throw error
      }
    }
  )
}
