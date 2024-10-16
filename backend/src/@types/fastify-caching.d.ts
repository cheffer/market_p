declare module 'fastify-caching' {
  import type { FastifyPluginCallback } from 'fastify'

  interface FastifyCachingOptions {
    privacy?: string
    expiresIn?: number
  }

  const fastifyCaching: FastifyPluginCallback<FastifyCachingOptions>
  export default fastifyCaching
}
