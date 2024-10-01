import fastify from 'fastify'
import fastifyCors from '@fastify/cors'

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { itemsController } from '../controllers/itemsController'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

// Configurações de validação e serialização
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Registrar controlador
app.register(itemsController)

app.listen({ port: 3030 }).then(() => {
  console.log('HTTP server running on port 3030')
})
