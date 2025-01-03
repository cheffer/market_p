import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import type { FastifyReply } from 'fastify'
import type {
  ErrorHandlerType,
  GetPurchasesQuery,
  PostPurchasesBody,
  PurchasesParams,
  PutPurchasesBody,
} from '../schemas/types'
import {
  deletePurchasesInDB,
  getCountPurchases,
  getPurchasesFromDB,
  insertPurchasesIntoDB,
  updatePurchasesSetDB,
} from '../repositories/purchasesRepository'

export async function getPurchasesService(filters: GetPurchasesQuery) {
  const { purchaseResult, totalRecords } = await getPurchasesFromDB(filters)
  const fullPage = Math.ceil(totalRecords / filters.limit)
  if (purchaseResult.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    purchaseResult: purchaseResult,
    pagination: {
      totalRecords,
      pagina: Math.floor(filters.offset / filters.limit) + 1,
      fullPage,
    },
  }
}

export async function postPurchasesService(purchaseData: PostPurchasesBody) {
  try {
    await insertPurchasesIntoDB(purchaseData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function putPurchasesService(
  purchaseData: PutPurchasesBody,
  purchaseParams: PurchasesParams
) {
  try {
    const resultCountPurchase = await getCountPurchases(purchaseParams)
    if (resultCountPurchase === 0) {
      throw new NotFoundError('Purchase not found')
    }
    await updatePurchasesSetDB(purchaseData, purchaseParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deletePurchasesService(purchaseParams: PurchasesParams) {
  try {
    const resultCountPurchase = await getCountPurchases(purchaseParams)
    if (resultCountPurchase === 0) {
      throw new NotFoundError('Purchase not found')
    }
    await deletePurchasesInDB(purchaseParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
