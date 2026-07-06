import { AppTheme } from "@/app/_layout";
import { ExpenseCategory } from "@api/schema";
import { JSX, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Chip,
  IconButton,
  List,
  Modal,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import {
  ExpenseItemObj,
  useExpenseStore,
} from "../../../../store/expense.store";

interface IProp {
  categories: ExpenseCategory[];
  categoriesOG: ExpenseCategory[];
  depth?: number;
}

const RenderCategories = ({
  categories,
  categoriesOG,
  depth = 0,
}: IProp): JSX.Element => {
  const theme = useTheme() as AppTheme;

  return (
    <>
      {categories.map((cat) => {
        const children = categoriesOG.filter((x) => cat.id === x.parentId);
        return (
          <List.Accordion
            key={cat.id}
            id={cat.id}
            title={cat.category}
            titleStyle={[styles.accordionTitle, depth > 0 && styles.childTitle]}
            style={[
              styles.accordionBase,
              {
                paddingLeft: 16 + depth * 16, // uvlačenje po nivou
                backgroundColor:
                  depth === 0
                    ? theme.colors.surface
                    : depth === 1
                      ? theme.colors.surfaceVariant
                      : theme.colors.elevation.level2,
              },
            ]}
            left={(props) =>
              depth > 0 ? (
                <List.Icon {...props} icon="subdirectory-arrow-right" />
              ) : (
                <List.Icon {...props} icon="folder" />
              )
            }
          >
            {children.length > 0 && (
              <RenderCategories
                categories={children}
                categoriesOG={categoriesOG}
                depth={depth + 1}
              />
            )}
          </List.Accordion>
        );
      })}
    </>
  );
};

interface ExpenseItemProps {
  item: ExpenseItemObj;
  i: number;
  categories: ExpenseCategory[];
}

const CategoryInput = ({ item, i, categories }: ExpenseItemProps) => {
  const theme = useTheme() as AppTheme;

  const updateItemInStore = useExpenseStore((s) => s.updateExpenseItem);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const freeCategories = categories.filter(
    (x) => !item.categories.includes(x.id),
  );

  return (
    <View style={styles.categoriesWrapper}>
      {item.categories.map((category) => {
        return (
          <Chip
            key={category}
            compact
            icon="tag"
            style={styles.chip}
            textStyle={styles.chipText}
            onClose={() =>
              updateItemInStore(i, {
                ...item,
                categories: item.categories.filter((x) => x !== category),
              })
            }
          >
            {categories.find((cat) => cat.id === category)?.category || (
              <Text>Unknown</Text>
            )}
          </Chip>
        );
      })}
      {/* <Text>All categories are added</Text> */}
      <IconButton
        icon="plus-circle"
        size={20}
        iconColor={theme.colors.primary}
        style={styles.iconButtonZeroMargin}
        onPress={openModal}
      />
      <Portal>
        <Modal
          visible={isModalOpen}
          onDismiss={closeModal}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background || "#fff" },
          ]}
        >
          <Text style={styles.modalTitle}>Add Category</Text>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* {categories.length === 0 ? (
              <Text style={styles.emptyText}>No more categories</Text>
            ) : (
              categories.map((cat) => (
                <TouchableRipple
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() => {
                    updateItemInStore(i, {
                      ...item,
                      categories: [...item.categories, cat.id],
                    });
                    closeModal();
                  }}
                >
                  <View style={styles.categoryRow}>
                    <Chip
                      icon="tag"
                      compact
                      style={{ backgroundColor: "transparent" }}
                    >
                      {cat.category}
                    </Chip>
                  </View>
                </TouchableRipple>
              ))
            )} */}

            <RenderCategories
              categories={categories.filter((x) => x.parentId === null)}
              categoriesOG={categories}
            />
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

export default CategoryInput;

const styles = StyleSheet.create({
  categoriesWrapper: {
    flex: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  chip: {
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  chipText: {
    fontSize: 11,
    marginVertical: 0,
    flexWrap: "wrap",
    marginRight: 20,
  },
  iconButtonZeroMargin: {
    margin: 0,
    padding: 0,
  },
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
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
