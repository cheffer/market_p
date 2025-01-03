import fastify from 'fastify'
import fastifyRedis from 'fastify-redis'
import { cacheMiddleware } from '../middleware/cacheMiddleware'
import { onRequestHook } from '../middleware/onRequestHook'
import { onResponseHook } from '../middleware/onResponseHook'
import { client, httpRequestDurationMicroseconds } from '../metrics/metrics'

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { itemsController } from '../controllers/itemsController'
import { errorHandler } from '../middleware/errorHandler'
import { categoriesController } from '../controllers/categoriesController'
import { craftsController } from '../controllers/craftsController'
import { creaturesController } from '../controllers/creaturesController'
import { creaturesDropsController } from '../controllers/creaturesDropsController'
import { professionsController } from '../controllers/professionsController'
import { purchasesController } from '../controllers/purchasesController'
import { salesController } from '../controllers/salesController'

const app = fastify({
  logger: {
    level: 'info', // Define o nível de log (info, warn, error, debug)
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
    //redact: ['req.headers.authorization', 'req.body.password'], // Redigir esses campos
  },
}).withTypeProvider<ZodTypeProvider>()

// Registra o middleware de caching antes de qualquer rota
app.addHook('onRequest', cacheMiddleware)
// Registra o hook onRequest
app.addHook('onRequest', onRequestHook)
// Registrar o hook onResponse
app.addHook('onResponse', onResponseHook)

// Configurações de validação e serialização
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Middleware de tratamento de erro
app.setErrorHandler(errorHandler)

// Redis e caching
app.register(fastifyRedis, {
  host: '127.0.0.1', // Padrão do Redis, use o host correto se necessário
  port: 6379, // Default do Redis
})

// Registrar controlador
app.register(itemsController)
app.register(categoriesController)
app.register(craftsController)
app.register(creaturesController)
app.register(creaturesDropsController)
app.register(professionsController)
app.register(purchasesController)
app.register(salesController)

// Health Check
app.get('/health', async (_, reply) => {
  reply.status(200).send({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date(),
  })
})

// Metrics
app.get('/metrics', async (_, reply) => {
  reply.header('Content-Type', client.register.contentType)
  reply.send(await client.register.metrics())
})

app.listen({ port: 3030 }, (err, address) => {
  if (err) {
    app.log.error(err) // Utilizando o logger nativo do Fastify
    process.exit(1)
  }
  app.log.info(`Server listening at ${address}`)
})
