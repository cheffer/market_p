import type { ErrorHandlerType } from '../schemas/types'

export class AppError extends Error {
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation error') {
    super(message, 422)
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500) // 500 para erros internos de banco de dados
  }
}

// Função para tratar códigos de erro de banco de dados
export function handleDatabaseError(error: ErrorHandlerType) {
  const dbError = error as { code?: string }

  switch (dbError.code) {
    case '23505':
      // Violação de unicidade (duplicidade de nome)
      throw new ConflictError('Item with this name already exists')
    case '23503':
      // Violação de chave estrangeira
      throw new ValidationError('Invalid id, foreign key constraint fails')
    case '23502':
      // Violação de not null
      throw new ValidationError(
        'A required field is missing (NOT NULL violation)'
      )
    default:
      // Outros erros de banco de dados
      console.error('Database error:', dbError)
      throw new DatabaseError('Error while processing database operation')
  }
}
