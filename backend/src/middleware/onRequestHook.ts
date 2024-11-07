import type {
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
} from 'fastify'

export function onRequestHook(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  // Definindo os headers de CORS
  reply.headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })

  // Se for uma requisição OPTIONS, responde imediatamente
  if (request.method === 'OPTIONS') {
    reply.status(204).send()
  } else {
    done()
  }
}
