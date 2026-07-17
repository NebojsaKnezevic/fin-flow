import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { useTheme } from "react-native-paper";
import { AppTheme } from "@/app/_layout";
import { ExpenseCategory } from "@api/schema";
import {
  ExpenseItemObj,
  useExpenseStore,
} from "../../../../../../store/expense.store";
import CategoryHelpers from "../../../../../../helpers/category.helpers";

interface DropdownPrimerProps {
  categories: ExpenseCategory[];
  item: ExpenseItemObj;
  index: number;
}

interface DropdownItem {
  label: string;
  value: number;
}

const SearchDropDown = ({ categories, item, index }: DropdownPrimerProps) => {
  const theme = useTheme() as AppTheme;
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const updateItemInStore = useExpenseStore((s) => s.updateExpenseItem);

  const toggleCategory = (catId: number) => {
    if (item.categories.includes(catId)) {
      const descendantsId: number[] = CategoryHelpers.getDescendantsIds(
        catId,
        categories,
      );

      updateItemInStore(index, {
        ...item,
        categories: item.categories.filter((x) => !descendantsId.includes(x)),
      });
    } else {
      // updateItemInStore(index, {
      //   ...item,
      //   categories: [...item.categories, catId],
      // });

      updateItemInStore(index, {
        ...item,
        // categories: [...item.categories, cat.id],
        categories: [
          ...item.categories,
          ...CategoryHelpers.getParentsIds(catId, categories),
          catId,
        ],
        //   categories: [
        //     cat.id,
        //     ...getParents(cat.id, categoriesOG),
        //   ].reverse(),
      });
    }
  };

  const data: DropdownItem[] = categories.map((cat) => ({
    label: cat.category,
    value: cat.id,
  }));

  return (
    <View style={styles.container}>
      <MultiSelect
        style={[
          styles.dropdown,
          {
            borderColor: isFocus ? theme.colors.primary : "#ccc",
            backgroundColor: theme.colors.background,
          },
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          { color: theme.colors.onSurfaceVariant },
        ]}
        selectedTextStyle={[styles.selectedTextStyle, { color: "white" }]}
        inputSearchStyle={[styles.inputSearchStyle, { color: "white" }]}
        containerStyle={[
          styles.dropdownContainer,
          { backgroundColor: theme.colors.elevation.level1 },
        ]}
        itemContainerStyle={styles.itemContainer}
        itemTextStyle={[styles.itemText, { color: "white" }]}
        activeColor={theme.colors.primaryContainer}
        flatListProps={{
          style: styles.flatList,
        }}
        // === Custom render da prikaže selektovane stavke ===
        renderItem={(dropdownItem) => {
          const isSelected = item.categories.includes(
            dropdownItem.value as number,
          );

          return (
            <View
              style={[
                styles.itemContainer,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primaryContainer
                    : "transparent",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={[
                  styles.itemText,
                  {
                    color: "white",
                    fontWeight: isSelected ? "600" : "400",
                  },
                ]}
              >
                {dropdownItem.label}
              </Text>
              {isSelected && (
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: 16,
                    paddingHorizontal: 4,
                  }}
                >
                  ✓
                </Text>
              )}
            </View>
          );
        }}
        // =====================================================
        search
        data={data}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Search Name" : "..."}
        searchPlaceholder="Search..."
        value={item.categories.map((x) => x.toString())}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(value: string[]) => {
          const added = value.find(
            (v) => !item.categories.map((x) => x.toString()).includes(v),
          );
          const removed = item.categories
            .map((x) => x.toString())
            .find((v) => !value.includes(v));

          if (added !== undefined) toggleCategory(Number(added));
          if (removed !== undefined) toggleCategory(Number(removed));
        }}
        visibleSelectedItem={false}
      />
    </View>
  );
};

export default SearchDropDown;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 3,
  },
  dropdown: {
    height: 40,
    borderWidth: 0,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 12,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "white",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
    color: "white",
  },
  dropdownContainer: {
    borderRadius: 8,
    borderWidth: 0,
    marginTop: 4,
    // paddingVertical: 52,
    overflow: "hidden",
    width: "auto",
    marginRight: 35,
  },
  itemContainer: {
    paddingVertical: 1,
    paddingHorizontal: 0,
  },
  itemText: {
    fontSize: 14,
  },
  flatList: {
    maxHeight: 250,
  },
});
