import * as React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Banner } from "react-native-paper";
import { useExpenseStore } from "../../../../store/expense.store";

const ImageBanner = (): React.JSX.Element => {
  const [visible, setVisible] = React.useState(true);
  const imageBase64: string | undefined = useExpenseStore((s) => s.imageBase64);

  const imageUri = imageBase64
    ? imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`
    : null;

  if (!imageUri) return <></>;

  return (
    <View style={styles.container}>
      <Banner
        visible={visible}
        actions={[
          {
            label: "Remove",
            onPress: () => setVisible(false),
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      </Banner>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
  },
  imageWrapper: {
    width: "100%",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
});

export default ImageBanner;
