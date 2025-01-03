import {
  ConflictError,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import type { FastifyReply } from 'fastify'
import type {
  ErrorHandlerType,
  GetSalesQuery,
  PostSalesBody,
  PutSalesBody,
  SalesParams,
} from '../schemas/types'
import {
  deleteSalesInDB,
  getCountSales,
  getSalesFromDB,
  insertSalesIntoDB,
  updateSalesSetDB,
} from '../repositories/salesRepository'

export async function getSalesService(filters: GetSalesQuery) {
  const { saleResult, totalRecords } = await getSalesFromDB(filters)
  const fullPage = Math.ceil(totalRecords / filters.limit)
  if (saleResult.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    saleResult: saleResult,
    pagination: {
      totalRecords,
      pagina: Math.floor(filters.offset / filters.limit) + 1,
      fullPage,
    },
  }
}

export async function postSalesService(saleData: PostSalesBody) {
  try {
    await insertSalesIntoDB(saleData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function putSalesService(
  saleData: PutSalesBody,
  saleParams: SalesParams
) {
  try {
    const resultCountsale = await getCountSales(saleParams)
    if (resultCountsale === 0) {
      throw new NotFoundError('sale not found')
    }
    await updateSalesSetDB(saleData, saleParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteSalesService(saleParams: SalesParams) {
  try {
    const resultCountsale = await getCountSales(saleParams)
    if (resultCountsale === 0) {
      throw new NotFoundError('sale not found')
    }
    await deleteSalesInDB(saleParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
