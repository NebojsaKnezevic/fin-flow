import Toast from "react-native-toast-message";

const error = (message: string, title: string = "Validation Error") => {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
    visibilityTime: 8000,
  });
};

const success = (message: string, title: string = "Success!") => {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
    visibilityTime: 8000,
  });
};

export const Notify = {
  error,
  success,
};
