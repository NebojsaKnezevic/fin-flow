import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { useTheme } from "react-native-paper";
import { AppTheme } from "@/app/_layout";
import { ExpenseCategory } from "@api/schema";
import {
  ExpenseItemObj,
  useExpenseStore,
} from "../../../../../../store/expense.store";

interface DropdownPrimerProps {
  categories: ExpenseCategory[];
  item: ExpenseItemObj;
  index: number;
}

interface DropdownItem {
  label: string;
  value: number;
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

const SearchDropDown = ({ categories, item, index }: DropdownPrimerProps) => {
  const theme = useTheme() as AppTheme;
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const updateItemInStore = useExpenseStore((s) => s.updateExpenseItem);

  const toggleCategory = (catId: number) => {
    if (item.categories.includes(catId)) {
      const descendantsId: number[] = getDescendants(catId, categories);

      updateItemInStore(index, {
        ...item,
        categories: item.categories.filter((x) => !descendantsId.includes(x)),
      });
    } else {
      updateItemInStore(index, {
        ...item,
        categories: [...item.categories, catId],
      });
    }
  };

  // Mapiramo podatke u format za dropdown
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
        selectedTextStyle={[styles.selectedTextStyle, , { color: "white" }]}
        inputSearchStyle={[styles.inputSearchStyle, { color: "white" }]}
        
        containerStyle={{ backgroundColor: theme.colors.elevation.level1 }}
        activeColor={theme.colors.primaryContainer}
        search
        data={data}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Search Name" : "..."}
        searchPlaceholder="Search..."
        value={item.categories}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(value: number[]) => {
          const added = value.find((v) => !item.categories.includes(v));
          const removed = item.categories.find((v) => !value.includes(v));

          if (added !== undefined) toggleCategory(added);
          if (removed !== undefined) toggleCategory(removed);
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
    flex: 5,
  },
  dropdown: {
    height: 40,
    borderWidth: 0,
    // borderRadius: 8,
    paddingHorizontal: 8,
    // color: "white",
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
});
