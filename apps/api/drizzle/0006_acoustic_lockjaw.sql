ALTER TABLE "expenses" ALTER COLUMN "source" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."expense_source";--> statement-breakpoint
CREATE TYPE "public"."expense_source" AS ENUM('basic', 'ai');--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "source" SET DATA TYPE "public"."expense_source" USING "source"::"public"."expense_source";--> statement-breakpoint
ALTER TABLE "expense_items" ALTER COLUMN "price" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "expense_items" ALTER COLUMN "quantity" SET DATA TYPE numeric;