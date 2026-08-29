import * as React from "react";
import { Image, View, StyleSheet } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { useExpenseStore } from "../../../../store/expense.store";
import { AppTheme } from "@/app/_layout";

type BannerProp = {
  imageBase64: string;
  index: number;
  isSelected: boolean;
};

const ImageBanner = ({
  imageBase64,
  index,
  isSelected,
}: BannerProp): React.JSX.Element => {
  const theme: AppTheme = useTheme();
  // const [isSelected, setIsSelected] = React.useState(false);
  const removeImg = useExpenseStore((s) => s.removeImage64);
  const selectImg = useExpenseStore((s) => s.selectImage64);

  const imageUri = imageBase64
    ? imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`
    : null;

  if (!imageUri) return <></>;

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={styles.previewImage}
          resizeMode="cover"
        />

        <IconButton
          icon="delete"
          iconColor="red"
          size={22}
          style={styles.leftIcon}
          onPress={() => removeImg(index)}
        />

        <IconButton
          icon={
            isSelected
              ? "checkbox-marked-circle"
              : "checkbox-blank-circle-outline"
          }
          iconColor={isSelected ? theme.colors.secondary : "#ffffff"}
          size={22}
          style={styles.rightIcon}
          onPress={() => selectImg(index)}
        />

        {!isSelected && <View style={styles.darkCover}></View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    marginBottom: 8,
  },
  imageWrapper: {
    width: "100%",
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 120,
  },
  leftIcon: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    margin: 0,
    zIndex: 1111,
  },
  rightIcon: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    margin: 0,
    zIndex: 1111,
  },
  darkCover: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});

export default ImageBanner;
