import { AppTheme } from "@/app/_layout";
import { ExpenseCategory } from "@api/schema";
import { JSX, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Button,
  Chip,
  IconButton,
  List,
  //   List,
  Modal,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import {
  ExpenseItemObj,
  useExpenseStore,
} from "../../../../../../store/expense.store";
import { useRouteNode } from "expo-router/build/Route";
import CategoryList from "./category-list.input";

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
      {/* <IconButton
        icon="plus-circle"
        size={20}
        iconColor={theme.colors.primary}
        style={styles.iconButtonZeroMargin}
        onPress={openModal}
        
      /> */}
      \
      <Button
        // icon="plus-circle"
        mode="contained-tonal"
        compact={true}
        // size={20}
        // iconColor={theme.colors.primary}
        style={styles.iconButtonZeroMargin}
        onPress={openModal}
      >
        Add Name
      </Button>
      <Portal>
        <Modal
          visible={isModalOpen}
          onDismiss={closeModal}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background || "#fff", padding: 0 },
          ]}
        >
          <Text style={styles.modalTitle}>Add Category</Text>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <CategoryList
              categories={categories.filter((x) => x.parentId === null)}
              categoriesOG={categories}
              item={item}
              index={i}
            />
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

// export default CategoryInput;

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
});
