import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'
import type {
  ErrorHandlerType,
  GetSalesQuery,
  PostSalesBody,
  PutSalesBody,
  SalesParams,
} from '../schemas/types'
import { sale } from '../db/schema'

export async function getSalesFromDB(filters: GetSalesQuery) {
  try {
    const totalCount = await db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(sale)
      .where(
        and(
          filters.itemId ? like(sale.itemId, `%${filters.itemId}%`) : undefined
        )
      )
    const totalRecords = Number(totalCount[0]?.count) || 0
    const query = db
      .select({
        saleId: sale.saleId,
        itemId: sale.itemId,
        quantity: sale.quantity,
        unitPrice: sale.unitPrice,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
      })
      .from(sale)

    const conditions = []

    if (filters.itemId) {
      conditions.push(eq(sale.itemId, filters.itemId))
    }

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    query.limit(filters.limit).offset(filters.offset)

    const saleResult = await query
    return { saleResult, totalRecords }
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch sale from the database')
  }
}

export async function insertSalesIntoDB(saleData: PostSalesBody) {
  try {
    await db.insert(sale).values({
      itemId: saleData.itemId,
      quantity: saleData.quantity,
      unitPrice: saleData.unitPrice,
    })
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function getCountSales(saleParams: SalesParams) {
  try {
    const query = db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(sale)
      .where(eq(sale.saleId, saleParams.saleId))
    const resultCountsales = await query
    const result = Number(resultCountsales[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch sale from the database')
  }
}

export async function updateSalesSetDB(
  saleData: PutSalesBody,
  saleParams: SalesParams
) {
  try {
    await db
      .update(sale)
      .set({
        quantity: saleData.quantity,
        unitPrice: saleData.unitPrice
          ? Number.parseFloat(saleData.unitPrice).toString()
          : '0',
        updatedAt: new Date(),
      })
      .where(eq(sale.saleId, saleParams.saleId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deleteSalesInDB(saleParams: SalesParams) {
  try {
    await db.delete(sale).where(eq(sale.saleId, saleParams.saleId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
