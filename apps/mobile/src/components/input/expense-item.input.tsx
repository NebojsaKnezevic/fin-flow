import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  TextInput,
  Text,
  IconButton,
  useTheme,
  Button,
} from "react-native-paper";
import { insertExpenseSchema } from "@api/schema";

interface ReceiptItem {
  localId: string;
  name: string;
  price: string;
  quantity: string;
}

export default function ExpenseItems() {
  const theme = useTheme();
  const keyList = Object.keys(insertExpenseSchema.shape);

  const [items, setItems] = useState<ReceiptItem[]>([
    { localId: "1", name: "Hleb Sava", price: "60", quantity: "1" },
    { localId: "2", name: "Moja Kravica Mleko", price: "160", quantity: "2" },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { localId: `item-${Date.now()}`, name: "", price: "", quantity: "1" },
    ]);
  };

  const removeItem = (localId: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.localId !== localId));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
        width: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                width: "100%",
                backgroundColor: theme.colors.background,
              }}
            >
              <View style={{ width: 32, marginRight: 0 }} />

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    flex: 4,
                    fontWeight: "bold",
                    fontSize: 13,
                    color: "#888",
                    textAlign: "left",
                  }}
                >
                  Category
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontWeight: "bold",
                    fontSize: 13,
                    color: "#888",
                    textAlign: "left",
                  }}
                >
                  Quan.
                </Text>

                <Text
                  style={{
                    flex: 1.5,
                    fontWeight: "bold",
                    fontSize: 13,
                    color: "#888",
                    textAlign: "left",
                  }}
                >
                  Price
                </Text>

                <Text
                  style={{
                    flex: 1.5,
                    fontWeight: "bold",
                    fontSize: 13,
                    color: "#888",
                    textAlign: "left",
                  }}
                >
                  Total
                </Text>
              </View>
            </View>

            {items.map((item, i) => {
              return (
                <View
                  key={item.localId}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 0,

                    width: "100%",
                    backgroundColor: theme.colors.background,
                  }}
                >
                  <IconButton
                    icon="minus-circle-outline"
                    iconColor="red"
                    size={16}
                    style={{ margin: 0, padding: 0 }}
                    onPress={() => removeItem(item.localId)}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <TextInput
                      value={item.name}
                      dense
                      style={{
                        backgroundColor: "transparent",
                        height: 30,
                        paddingHorizontal: 0,
                        margin: 0,
                        // minWidth: "30%",
                        textAlign: "left",
                        fontSize: 14,
                        color: "#666",
                        flex: 4,
                      }}
                    />

                    <TextInput
                      //   value={item.name}
                      dense
                      keyboardType="numeric"
                      style={{
                        backgroundColor: "transparent",
                        height: 30,
                        paddingHorizontal: 0,
                        margin: 0,
                        // minWidth: "2%",
                        textAlign: "left",
                        fontSize: 14,
                        color: "#666",
                        flex: 1,
                      }}
                    />

                    <TextInput
                      //   value={item.name}
                      dense
                      keyboardType="numeric"
                      style={{
                        backgroundColor: "transparent",
                        height: 30,
                        paddingHorizontal: 0,
                        margin: 0,
                        // minWidth: "5%",
                        textAlign: "left",
                        fontSize: 14,
                        color: "#666",
                        flex: 1.5,
                      }}
                    />

                    <TextInput
                      //   value={item.name}
                      dense
                      disabled={true}
                      style={{
                        backgroundColor: "transparent",
                        height: 30,
                        paddingHorizontal: 0,
                        margin: 0,
                        // minWidth: "5%",
                        textAlign: "left",
                        fontSize: 14,
                        color: "#666",
                        flex: 1.5,
                      }}
                    />
                  </View>
                </View>
              );
            })}

            <View
              style={{
                paddingHorizontal: 16,
                marginTop: 12,
                marginBottom: 24,
              }}
            >
              <Button
                icon="plus"
                mode="contained-tonal" // ili "contained" ako želiš jaču boju pozadine dugmeta
                onPress={addItem}
                contentStyle={{ height: 40 }}
                style={{ borderRadius: 8 }}
              >
                Dodaj stavku
              </Button>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
