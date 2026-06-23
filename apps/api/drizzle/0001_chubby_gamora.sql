CREATE TABLE "expense_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"price" double precision NOT NULL,
	"quantity" double precision NOT NULL,
	"category_id" integer NOT NULL,
	"expense_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" RENAME COLUMN "amount" TO "total_amount";--> statement-breakpoint
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_category_id_expense_category_id_fk";
--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_category_id_expense_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_category" DROP COLUMN "test_kolona";--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "category_id";