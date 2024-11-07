// src/types/fastify.d.ts
import 'fastify'

declare module 'fastify' {
  interface FastifyReply {
    sendCache: <T>(data: T) => Promise<void>
  }
}
