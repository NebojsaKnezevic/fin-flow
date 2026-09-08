ALTER TABLE "expense_category" ADD COLUMN "description" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "expense_category" ADD COLUMN "icon" text DEFAULT 'folder';--> statement-breakpoint
ALTER TABLE "expense_category" ADD COLUMN "color" text DEFAULT '#000000';