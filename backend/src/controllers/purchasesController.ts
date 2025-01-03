import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  getPurchasesQuerySchema,
  postPurchasesBodySchema,
  purchasesParams,
  putPurchasesBodySchema,
} from '../schemas/purchasesSchemas'
import type {
  GetPurchasesQuery,
  PostPurchasesBody,
  PurchasesParams,
  PutPurchasesBody,
} from '../schemas/types'
import {
  deletePurchasesService,
  getPurchasesService,
  postPurchasesService,
  putPurchasesService,
} from '../services/purchasesService'

export const purchasesController: FastifyPluginAsync = async app => {
  // Route from get purchase
  app.get(
    '/purchases',
    { schema: { querystring: getPurchasesQuerySchema } },
    async (
      request: FastifyRequest<{ Querystring: GetPurchasesQuery }>,
      reply: FastifyReply
    ) => {
      const { itemId, limit, offset } = request.query
      try {
        const { purchaseResult, pagination } = await getPurchasesService({
          itemId,
          limit,
          offset,
        })
        reply.status(200).send({ purchaseResult, pagination })
      } catch (error) {
        request.log.error('Error when searching purchases', error)
        throw error
      }
    }
  )

  // Route from post purchase
  app.post(
    '/purchases',
    { schema: { body: postPurchasesBodySchema } },
    async (
      request: FastifyRequest<{ Body: PostPurchasesBody }>,
      reply: FastifyReply
    ) => {
      const purchaseData = request.body
      try {
        await postPurchasesService(purchaseData)
        reply.status(201).send('Purchase created successfully')
      } catch (error) {
        request.log.error('Error creating purchase', error)
        throw error
      }
    }
  )

  // Route from put purchase
  app.put(
    '/purchases/:purchaseId',
    { schema: { body: putPurchasesBodySchema, params: purchasesParams } },
    async (
      request: FastifyRequest<{
        Body: PutPurchasesBody
        Params: PurchasesParams
      }>,
      reply: FastifyReply
    ) => {
      const purchaseData = request.body
      const purchaseParams = request.params
      try {
        await putPurchasesService(purchaseData, purchaseParams)
        reply.status(200).send('Purchase updated successfully')
      } catch (error) {
        request.log.error(
          `Error updating purchase with ID: ${purchaseParams.purchaseId}`,
          error
        )
        throw error
      }
    }
  )

  // Route from delete purchase
  app.delete(
    '/purchases/:purchaseId',
    { schema: { params: purchasesParams } },
    async (
      request: FastifyRequest<{ Params: PurchasesParams }>,
      reply: FastifyReply
    ) => {
      const purchaseParams = request.params
      try {
        await deletePurchasesService(purchaseParams)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting purchase with ID: ${purchaseParams.purchaseId}`,
          error
        )
        throw error
      }
    }
  )
}
