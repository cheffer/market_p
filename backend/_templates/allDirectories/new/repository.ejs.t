---
to: src/repositories/<%= name %>Repository.ts
---
import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'