DROP TABLE "favorite";--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "favorite" boolean DEFAULT false NOT NULL;