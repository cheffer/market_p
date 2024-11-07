import fastify from 'fastify'
import fastifyRedis from 'fastify-redis'
import { cacheMiddleware } from '../middleware/cacheMiddleware'
import { onRequestHook } from '../middleware/onRequestHook'

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { itemsController } from '../controllers/itemsController'
import { errorHandler } from '../middleware/errorHandler'

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

/*app.get('/health', async (request, reply) => {
  reply.status(200).send({ status: 'OK', uptime: process.uptime() })
})

import { db } from './db'; // Assumindo que você tem um arquivo para conectar ao banco

app.get('/health', async (request, reply) => {
  try {
    // Tentativa de consultar algo simples no banco
    await db.raw('SELECT 1');
    reply.status(200).send({ status: 'OK', database: 'connected', uptime: process.uptime() });
  } catch (error) {
    reply.status(500).send({ status: 'ERROR', database: 'disconnected' });
  }
});*/

/*
npm install prom-client
import client from 'prom-client';

// Configurar o coletor de métricas
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // Coleta métricas padrão como memória e CPU

app.get('/metrics', async (request, reply) => {
  try {
    const metrics = await client.register.metrics();
    reply.header('Content-Type', client.register.contentType);
    reply.send(metrics);
  } catch (err) {
    reply.status(500).send(err.message);
  }
});*/

/*app.listen({ port: 3030 }).then(() => {
  console.log('HTTP server running on port 3030')
})*/
app.listen({ port: 3030 }, (err, address) => {
  if (err) {
    app.log.error(err) // Utilizando o logger nativo do Fastify
    process.exit(1)
  }
  app.log.info(`Server listening at ${address}`)
})
