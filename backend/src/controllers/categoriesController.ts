import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import {
  deleteCategoriesService,
  getCategoriesService,
  postCategoriesService,
  putCategoriesService,
} from '../services/categoriesService'
import {
  categoriesParams,
  postCategoriesBodySchema,
  putCategoriesBodySchema,
} from '../schemas/categoriesSchemas'
import type {
  CategoriesParams,
  PostCategoriesBody,
  PutCategoriesBody,
} from '../schemas/types'

export const categoriesController: FastifyPluginAsync = async app => {
  // Route from get categories
  app.get(
    '/categories',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await getCategoriesService()
        reply.status(200).send(result)
      } catch (error) {
        // Logando erro
        request.log.error('Error when searching categories', error)
        throw error // O middleware de erros lidará com o erro
      }
    }
  )

  // Route from post categories
  app.post(
    '/categories',
    { schema: { body: postCategoriesBodySchema } },
    async (
      request: FastifyRequest<{ Body: PostCategoriesBody }>,
      reply: FastifyReply
    ) => {
      const categoryData = request.body
      try {
        await postCategoriesService(categoryData)
        reply.status(201).send('Category created successfully')
      } catch (error) {
        request.log.error('Error creating category', error)
        throw error
      }
    }
  )

  // Route from put categories
  app.put(
    '/categories/:categoryId',
    { schema: { body: putCategoriesBodySchema, params: categoriesParams } },
    async (
      request: FastifyRequest<{
        Body: PutCategoriesBody
        Params: CategoriesParams
      }>,
      reply: FastifyReply
    ) => {
      const categoryData = request.body
      const categoryParams = request.params
      try {
        await putCategoriesService(categoryData, categoryParams)
        reply.status(200).send('Category updated successfully')
      } catch (error) {
        request.log.error(
          `Error updating category with ID: ${categoryParams.categoryId}`,
          error
        )
        throw error
      }
    }
  )

  // Route from put categories
  app.delete(
    '/categories/:categoryId',
    { schema: { params: categoriesParams } },
    async (
      request: FastifyRequest<{ Params: CategoriesParams }>,
      reply: FastifyReply
    ) => {
      const categoryParams = request.params
      try {
        await deleteCategoriesService(categoryParams)
        reply.status(204).send()
      } catch (error) {
        request.log.error(
          `Error deleting category with ID: ${categoryParams.categoryId}`,
          error
        )
        throw error
      }
    }
  )
}
