import { eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { category, item, itemDependency } from '../db/schema'

export async function getListItems() {
  const getItems = db.$with('get_items').as(db.select().from(item))
  const getCategories = db
    .$with('get_categories')
    .as(db.select().from(category))
  const getDependency = db
    .$with('get_dependency')
    .as(db.select().from(itemDependency))
  const getDependencyItems = db
    .$with('get_dependecy_items')
    .as(db.select().from(item))
  const getDependencyCategories = db
    .$with('get_dependecy_categories')
    .as(db.select().from(category))

  const listItems = await db
    .with(
      getItems,
      getCategories,
      getDependency,
      getDependencyItems,
      getDependencyCategories
    )
    .select({
      id: getItems.itemId,
      name: getItems.name,
      descriptionItem: getItems.description,
      howToObtain: getItems.howToObtain,
      category: getCategories.name,
      descriptionCategory: getCategories.description,
      itemDependecies: sql /*sql*/`
      COALESCE(
          JSON_AGG(
              CASE 
                WHEN ${getDependencyItems.name} IS NOT NULL THEN
                  JSON_BUILD_OBJECT(
                    'name', ${getDependencyItems.name},
                    'descriptionItem', ${getDependencyItems.description},
                    'howToObtain', ${getDependencyItems.howToObtain},
                    'category',  ${getDependencyCategories.name},
                    'descriptionCategory', ${getDependencyCategories.description}
                  )
                ELSE NULL
              END
          ) FILTER (WHERE ${getDependencyItems.name} IS NOT NULL),
          '[]'  -- Retorna array vazio quando não há dependências
        )
      `.as('itemDependecies'),
    })
    .from(getItems)
    .innerJoin(getCategories, eq(getItems.categoryId, getCategories.categoryId))
    .leftJoin(getDependency, eq(getItems.itemId, getDependency.itemId))
    .leftJoin(
      getDependencyItems,
      eq(getDependency.itemDependecyId, getDependencyItems.itemId)
    )
    .leftJoin(
      getDependencyCategories,
      eq(getDependencyItems.categoryId, getDependencyCategories.categoryId)
    )
    .groupBy(
      getItems.itemId,
      getItems.name,
      getItems.description,
      getItems.howToObtain,
      getCategories.name,
      getCategories.description
    )

  return { listItems }
}
