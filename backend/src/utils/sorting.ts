import type { Column, SQL } from 'drizzle-orm'
import { asc, desc } from 'drizzle-orm'

// Definindo o tipo dos filtros
interface Filters {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Função para retornar o método de ordenação baseado no valor de "order"
export const getSortMethod = (
  column: Column | SQL.Aliased,
  order: 'asc' | 'desc'
) => {
  return order === 'desc' ? desc(column) : asc(column)
}

// Função para garantir que os filtros tenham valores padrão
export const getFiltersWithDefaults = (filters: Filters): Filters => {
  if (!filters.sortBy) {
    filters.sortBy = 'column'
  }

  if (!filters.sortOrder) {
    filters.sortOrder = 'asc'
  }

  return filters
}

// Função para obter a ordenação com base nos filtros
export const getSortingFromFilters = (
  filters: Filters,
  column: Column | SQL.Aliased
) => {
  const updatedFilters = getFiltersWithDefaults(filters)

  return getSortMethod(column, updatedFilters.sortOrder as 'asc' | 'desc')
}
