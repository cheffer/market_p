-- Criar índice único para garantir que (creature_id, item_id) sejam únicos
CREATE UNIQUE INDEX unique_creature_item ON creature_drop(creature_id, item_id);