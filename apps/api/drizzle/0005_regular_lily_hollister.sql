CREATE TABLE "expense_items_categories" (
	"item_id" uuid NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "expense_items_categories_item_id_category_id_pk" PRIMARY KEY("item_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "expense_items" DROP CONSTRAINT "expense_items_category_id_expense_category_id_fk";
--> statement-breakpoint
ALTER TABLE "expense_items_categories" ADD CONSTRAINT "expense_items_categories_item_id_expense_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."expense_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items_categories" ADD CONSTRAINT "expense_items_categories_category_id_expense_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" DROP COLUMN "category_id";