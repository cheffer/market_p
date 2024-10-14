import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../errors/customErrors'

export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof AppError) {
    // Se o erro for uma instância de AppError, trata de acordo com o status code
    reply.status(error.statusCode).send({
      error: error.message,
      statusCode: error.statusCode,
    })
  } else {
    // Erros desconhecidos ou internos são tratados aqui
    console.error(error) // Loga o erro para depuração
    reply.status(500).send({
      error: 'Internal Server Error',
      message: error.message,
    })
  }
}
