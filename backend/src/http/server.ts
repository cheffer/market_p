import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import { getListItemRoutes } from './routes/get-list-items'
import { getItemsRoute } from './routes/item'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

//teste
app.register(getListItemRoutes)

//Routes
app.register(getItemsRoute)

app
  .listen({
    port: 3030,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
