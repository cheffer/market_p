---
to: src/services/<%= name %>Service.ts
---
import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import type { FastifyReply } from 'fastify'