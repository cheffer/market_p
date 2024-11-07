import type { FastifyReply, FastifyRequest } from 'fastify'

export async function cacheMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Verifique se é uma requisição GET para usar o cache
  if (request.method === 'GET') {
    const cacheKey = `${request.url}` // Crie uma chave de cache simples com base na URL

    // Verificar se a chave existe no Redis
    const cached = await reply.server.redis.get(cacheKey)
    if (cached) {
      // Se existir no cache, retorna a resposta armazenada
      reply.send(JSON.parse(cached))
      return
    }

    // Armazenar uma função para enviar os dados ao cache após a execução da rota
    reply.sendCache = async <T>(data: T) => {
      await reply.server.redis.set(cacheKey, JSON.stringify(data), 'EX', 3600) // Cache por 1 hora
    }
  }
}
