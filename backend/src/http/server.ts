import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import pino from 'pino'

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
  },
}).withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

// Configurações de validação e serialização
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Middleware de tratamento de erro
app.setErrorHandler(errorHandler)

// Registrar controlador
app.register(itemsController)

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
