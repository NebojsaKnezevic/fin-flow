interface RawCategoryRow {
  linkId: number | null;
  categoryId: number;
  category: string;
  subcategory: string | null;
}

// Definišemo tip podatka kakav želiš da pošalješ na frontend
interface FormattedCategory {
  categoryId: number;
  category: string;
  subcategories: string[]; // Niz stringova (imena podkategorija)
}

export function formatCategoriesToTree(
  rows: RawCategoryRow[],
): FormattedCategory[] {
  // Koristimo Map za brzo grupisanje po id-u glavne kategorije
  const categoryMap = new Map<number, FormattedCategory>();

  for (const row of rows) {
    // Ako kategorija još uvek ne postoji u našoj mapi, dodajemo je
    if (!categoryMap.has(row.categoryId)) {
      categoryMap.set(row.categoryId, {
        categoryId: row.categoryId,
        category: row.category,
        subcategories: [],
      });
    }

    // Uzimamo referencu na tu kategoriju iz mape
    const currentCategory = categoryMap.get(row.categoryId)!;

    // Ako red ima podkategoriju (nije null) i ako je već nismo dodali, ubacujemo je u niz
    if (
      row.subcategory &&
      !currentCategory.subcategories.includes(row.subcategory)
    ) {
      currentCategory.subcategories.push(row.subcategory);
    }
  }

  // Pretvaramo mapu nazad u običan niz objekata
  return Array.from(categoryMap.values());
}
