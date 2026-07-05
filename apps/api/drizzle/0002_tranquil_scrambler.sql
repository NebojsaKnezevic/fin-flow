CREATE TABLE "expense_sub_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"subcategory_id" integer
);
--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "total_amount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "total_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "name" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "expense_sub_category" ADD CONSTRAINT "expense_sub_category_category_id_expense_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_sub_category" ADD CONSTRAINT "expense_sub_category_subcategory_id_expense_category_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."expense_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" DROP COLUMN "name";