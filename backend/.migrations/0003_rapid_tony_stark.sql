ALTER TABLE "item" ADD COLUMN "npc_value" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "item_value" DROP COLUMN IF EXISTS "npc_value";