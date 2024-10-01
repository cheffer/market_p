import { ilike } from 'drizzle-orm'
import { client, db } from '.'
import {
  category,
  craft,
  creature,
  creatureDrop,
  item,
  itemDependency,
  itemValue,
  profession,
  purchase,
  sale,
  simulation,
} from './schema'

async function seed() {
  await db.delete(item).where(ilike(item.name, '%teste %'))
  await db.delete(category)
  await db.delete(profession)
  await db.delete(creature).where(ilike(creature.name, '%teste %'))

  const resultCategory = await db
    .insert(category)
    .values([
      { name: 'Items', description: 'Itens gerais' },
      {
        name: 'Stones',
        description: 'Pedras de evolução',
      },
      { name: 'Poke Balls', description: 'Poke bolas' },
      {
        name: 'Diamonds',
        description: 'Item de diamante',
      },
      {
        name: 'Addons',
        description: 'Roupas para pokemon',
      },
      {
        name: 'Outfits',
        description: 'Roupas para jogadores',
      },
      { name: 'Pokemons', description: 'Pokemons' },
      {
        name: 'Held Items',
        description: 'Held itens x e y',
      },
      { name: 'Furnitures', description: 'Moveis' },
      { name: 'Books', description: 'Livros' },
      {
        name: 'Students',
        description: 'Cards de estudantes de professor',
      },
      {
        name: 'Berries',
        description: 'Plantas de professor',
      },
      { name: 'Foods', description: 'Comidas' },
      { name: 'Utilities', description: 'Utilitários' },
      { name: 'Supplies', description: 'Poções' },
      { name: 'Essences', description: 'Essencias' },
      { name: 'Toys', description: 'Bonecos' },
      { name: 'Bags', description: 'Bolsas' },
    ])
    .returning()

  const resultItem = await db
    .insert(item)
    .values([
      {
        name: 'teste 1',
        description: 'item 1 para fazer teste ',
        categoryId: resultCategory[3].categoryId,
        howToObtain: 'Crafitando',
        npcValue: '12.3',
      },
      {
        name: 'teste 2',
        description: 'item 2 para fazer teste ',
        categoryId: resultCategory[3].categoryId,
        howToObtain: 'Crafitando',
        npcValue: '10',
      },
      {
        name: 'teste 3',
        description: 'item 1 para fazer teste ',
        categoryId: resultCategory[4].categoryId,
        howToObtain: 'Crafitando',
        npcValue: '8.5',
      },
      {
        name: 'teste 4',
        description: 'item 1 para fazer teste ',
        categoryId: resultCategory[7].categoryId,
        howToObtain: 'Crafitando',
        npcValue: '20',
      },
      {
        name: 'teste 5',
        description: 'item 1 para fazer teste ',
        categoryId: resultCategory[7].categoryId,
        howToObtain: 'Crafitando',
        npcValue: '23.2',
      },
      {
        name: 'teste 6',
        description: 'item 1 para fazer teste ',
        categoryId: resultCategory[3].categoryId,
        howToObtain: 'Crafitando',
        npcValue: '14',
      },
    ])
    .returning()

  const resultProfession = await db
    .insert(profession)
    .values([
      {
        name: 'Professor',
        specialization: 'Professor',
        rank: 'E até A',
        skill: '0 até 100',
      },
      {
        name: 'Professor',
        specialization: 'Alquimista',
        rank: 'S',
        skill: '100 até 120',
      },
      {
        name: 'Professor',
        specialization: 'Acadêmico',
        rank: 'S',
        skill: '100 até 120',
      },
      {
        name: 'Estilista',
        specialization: 'Estilista',
        rank: 'E até A',
        skill: '0 até 100',
      },
      {
        name: 'Estilista',
        specialization: 'Designer',
        rank: 'S',
        skill: '100 até 120',
      },
      {
        name: 'Estilista',
        specialization: 'Decorador',
        rank: 'S',
        skill: '100 até 120',
      },
      {
        name: 'Engenheiro',
        specialization: 'Engenheiro',
        rank: 'E até A',
        skill: '0 até 100',
      },
      {
        name: 'Engenheiro',
        specialization: 'Hacker',
        rank: 'S',
        skill: '100 até 120',
      },
      {
        name: 'Engenheiro',
        specialization: 'Mecânico',
        rank: 'S',
        skill: '100 até 120',
      },
      {
        name: 'Aventureiro',
        specialization: 'Aventureiro',
        rank: 'E até A',
        skill: '0 até 100',
      },
      {
        name: 'Aventureiro',
        specialization: 'Arqueólogo',
        rank: 'S',
        skill: '100 até 120',
      },
      {
        name: 'Aventureiro',
        specialization: 'Cozinheiro',
        rank: 'S',
        skill: '100 até 120',
      },
    ])
    .returning()

  const resultCreature = await db.insert(creature).values([
    { name: 'Teste Criatura 1', location: 'Montanha', type: 'Voador' },
    { name: 'Teste Criatura 2', location: 'Agua', type: 'Aquatico' },
    { name: 'Teste Criatura 3', location: 'Caverna', type: 'Terra' },
  ])
}

seed().finally(() => {
  client.end()
})
