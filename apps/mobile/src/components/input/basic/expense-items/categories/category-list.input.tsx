import { StyleSheet } from "react-native";
import { List, useTheme } from "react-native-paper";
import {
  ExpenseItemObj,
  useExpenseStore,
} from "../../../../../../store/expense.store";
import { AppTheme } from "@/app/_layout";
import { JSX } from "react";
import { ExpenseCategory } from "@api/schema";
import { useThemeStore } from "../../../../../../store/theme.store";

interface IProp {
  categories: ExpenseCategory[];
  categoriesOG: ExpenseCategory[];
  depth?: number;
  item: ExpenseItemObj;
  index: number;
}

function getDescendants(id: number, categories: ExpenseCategory[]): number[] {
  const children = categories.filter((c) => c.parentId === id);

  let result: number[] = [];

  for (const child of children) {
    result.push(child.id);
    result.push(...getDescendants(child.id, categories));
  }

  return [id, ...result];
}

function getParents(id: number, categories: ExpenseCategory[]): number[] {
  const item = categories.find((c) => c.id === id);
  if (item?.parentId === null) return [];
  return [item?.parentId, ...getParents(item?.parentId, categories)];
}

const CategoryList = ({
  categories,
  categoriesOG,
  depth = 0,
  item,
  index,
}: IProp): JSX.Element => {
  const theme: AppTheme = useTheme();

  //   const [x, setX] = useState(false);
  const updateItemInStore = useExpenseStore((s) => s.updateExpenseItem);

  return (
    <>
      {categories.map((cat: ExpenseCategory) => {
        const children = categoriesOG.filter((x) => cat.id === x.parentId);
        return (
          <List.Accordion
            key={cat.id}
            id={cat.id}
            expanded={item.categories.includes(cat.id)}
            // expanded={true}
            rippleColor={theme.ripple.color}
            title={cat.category}
            titleStyle={[styles.accordionTitle, depth > 0 && styles.childTitle]}
            onPress={(e) => {
              e.preventDefault();
              //   console.log("pressed", cat.id);
              //if it has the cat, we remove it, if it doesnt we add it
              if (item.categories.includes(cat.id)) {
                const descendantsId: number[] = getDescendants(
                  cat.id,
                  categoriesOG,
                );

                updateItemInStore(index, {
                  ...item,
                  //   categories: [...item.categories.filter((x) => x !== cat.id)],
                  categories: item.categories
                    .map((c) => c)
                    .filter((x) => !descendantsId.includes(x)),
                });
              } else {
                updateItemInStore(index, {
                  ...item,
                  categories: [...item.categories, cat.id],
                  //   categories: [
                  //     cat.id,
                  //     ...getParents(cat.id, categoriesOG),
                  //   ].reverse(),
                });
              }
            }}
            style={[
              styles.accordionBase,
              {
                paddingLeft: 16 + depth * 16,
                backgroundColor: theme.colors.background,
                margin: 0,
              },
            ]}
            right={(props) => {
              //   setX((prev) => !prev);

              return children.length > 0 ? (
                <List.Icon
                  {...props}
                  icon={props.isExpanded ? "chevron-up" : "chevron-down"}
                />
              ) : (
                <List.Icon {...props} icon="minus" />
              );
            }}
            left={(props) =>
              depth > 0 ? (
                <List.Icon {...props} icon="tag" />
              ) : (
                <List.Icon {...props} icon="tag" />
              )
            }
          >
            {children.length > 0 && (
              <CategoryList
                categories={children}
                categoriesOG={categoriesOG}
                depth={depth + 1}
                item={item}
                index={index}
              />
            )}
          </List.Accordion>
        );
      })}
    </>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  /* STILOVI ZA MODAL */
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: "60%", // Da ne pobegne van ekrana ako ima 50 kategorija
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalScroll: {
    marginVertical: 5,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },

  accordionBase: {
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: "#e0e0e0",
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  childTitle: {
    fontSize: 13,
    fontWeight: "400",
  },
});
