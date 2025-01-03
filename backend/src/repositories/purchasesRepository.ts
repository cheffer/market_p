import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'
import type {
  ErrorHandlerType,
  GetPurchasesQuery,
  PostPurchasesBody,
  PurchasesParams,
  PutPurchasesBody,
} from '../schemas/types'
import { purchase } from '../db/schema'

export async function getPurchasesFromDB(filters: GetPurchasesQuery) {
  try {
    const totalCount = await db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(purchase)
      .where(
        and(
          filters.itemId
            ? like(purchase.itemId, `%${filters.itemId}%`)
            : undefined
        )
      )
    const totalRecords = Number(totalCount[0]?.count) || 0

    const query = db
      .select({
        purchaseId: purchase.purchaseId,
        itemId: purchase.itemId,
        quantity: purchase.quantity,
        unitPrice: purchase.unitPrice,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      })
      .from(purchase)

    const conditions = []

    if (filters.itemId) {
      conditions.push(eq(purchase.itemId, filters.itemId))
    }

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    query.limit(filters.limit).offset(filters.offset)

    const purchaseResult = await query
    return { purchaseResult, totalRecords }
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch purchase from the database')
  }
}

export async function insertPurchasesIntoDB(purchaseData: PostPurchasesBody) {
  try {
    await db.insert(purchase).values({
      itemId: purchaseData.itemId,
      quantity: purchaseData.quantity,
      unitPrice: purchaseData.unitPrice,
    })
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function getCountPurchases(purchaseParams: PurchasesParams) {
  try {
    const query = db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(purchase)
      .where(eq(purchase.purchaseId, purchaseParams.purchaseId))
    const resultCountPurchases = await query
    const result = Number(resultCountPurchases[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch purchase from the database')
  }
}

export async function updatePurchasesSetDB(
  purchaseData: PutPurchasesBody,
  purchaseParams: PurchasesParams
) {
  try {
    await db
      .update(purchase)
      .set({
        quantity: purchaseData.quantity,
        unitPrice: purchaseData.unitPrice
          ? Number.parseFloat(purchaseData.unitPrice).toString()
          : '0',
        updatedAt: new Date(),
      })
      .where(eq(purchase.purchaseId, purchaseParams.purchaseId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

export async function deletePurchasesInDB(purchaseParams: PurchasesParams) {
  try {
    await db
      .delete(purchase)
      .where(eq(purchase.purchaseId, purchaseParams.purchaseId))
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
