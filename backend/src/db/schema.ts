import { createId } from '@paralleldrive/cuid2'
import {
  pgTable,
  text,
  timestamp,
  integer,
  interval,
  varchar,
  decimal,
  boolean,
} from 'drizzle-orm/pg-core'

export const category = pgTable('category', {
  categoryId: text('category_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const item = pgTable('item', {
  itemId: text('item_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  description: text('description'),
  categoryId: text('category_id')
    .references(() => category.categoryId)
    .notNull(),
  howToObtain: text('how_to_obtain'),
  favorite: boolean('favorite').notNull().default(false),
  npcValue: decimal('npc_value', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const itemDependency = pgTable('item_dependency', {
  itemDependecyId: text('item_dependency_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  itemId: text('item_id')
    .references(() => item.itemId)
    .notNull(),
  dependentItemId: text('Dependent_item_id')
    .references(() => item.itemId)
    .notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const itemValue = pgTable('item_value', {
  itemValueId: text('item_value_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  itemId: text('item_id')
    .references(() => item.itemId)
    .notNull(),
  minSellPrice: decimal('min_sell_price', { precision: 12, scale: 2 }),
  avgSellPrice: decimal('avg_sell_price', { precision: 12, scale: 2 }),
  maxSellPrice: decimal('max_sell_price', { precision: 12, scale: 2 }),
  currentSellPrice: decimal('current_sell_price', { precision: 12, scale: 2 }),
  sellRate: decimal('sell_rate', { precision: 3, scale: 2 }),
  minBuyPrice: decimal('min_buy_price', { precision: 12, scale: 2 }),
  avgBuyPrice: decimal('avg_buy_price', { precision: 12, scale: 2 }),
  maxBuyPrice: decimal('max_buy_price', { precision: 12, scale: 2 }),
  currentBuyPrice: decimal('current_buy_price', { precision: 12, scale: 2 }),
  buyRate: decimal('buy_rate', { precision: 3, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const purchase = pgTable('purchase', {
  purchaseId: text('purchase_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  itemId: text('item_id')
    .references(() => item.itemId)
    .notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const sale = pgTable('sale', {
  saleId: text('sale_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  itemId: text('item_id')
    .references(() => item.itemId)
    .notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const profession = pgTable('profession', {
  professionId: text('profession_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  specialization: text('specialization').notNull(),
  rank: text('rank').notNull(),
  skill: text('skill').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const craft = pgTable('craft', {
  craftId: text('craft_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  itemId: text('item_id')
    .references(() => item.itemId)
    .notNull(),
  professionId: text('profession_id')
    .references(() => profession.professionId)
    .notNull(),
  requiredRank: varchar('required_rank', { length: 1 }),
  requiredSkill: integer('required_skill'),
  producedQuantity: integer('produced_quantity'),
  creationTime: interval('creation_time'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const creature = pgTable('creature', {
  creatureId: text('creature_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  type: text('type'),
  location: text('location'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const creatureDrop = pgTable('creature_drop', {
  creatureDropId: text('creature_drop_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  creatureId: text('creature_id')
    .references(() => creature.creatureId)
    .notNull(),
  itemId: text('item_id')
    .references(() => item.itemId)
    .notNull(),
  dropChance: decimal('drop_chance'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const simulation = pgTable('simulation', {
  simulationId: text('simulation_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  itemId: text('item_id')
    .references(() => item.itemId)
    .notNull(),
  quantity: integer('quantity').notNull(),
  minBuyCost: decimal('min_buy_cost', { precision: 12, scale: 2 }),
  avgBuyCost: decimal('avg_buy_cost', { precision: 12, scale: 2 }),
  maxBuyCost: decimal('max_buy_cost', { precision: 12, scale: 2 }),
  currentBuyCost: decimal('current_buy_cost', { precision: 12, scale: 2 }),
  minSellProfit: decimal('min_sell_profit', { precision: 12, scale: 2 }),
  avgSellProfit: decimal('avg_sell_profit', { precision: 12, scale: 2 }),
  maxSellProfit: decimal('max_sell_profit', { precision: 12, scale: 2 }),
  currentSellProfit: decimal('current_sell_profit', {
    precision: 12,
    scale: 2,
  }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
