import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import InputScreen from "../../screens/input/input.screen";
import { useState } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

const InputsRoute = () => <InputScreen />;

export default function App() {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: "Input",
      title: "Input",
      focusedIcon: "wallet",
      unfocusedIcon: "wallet-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    Input: InputsRoute,
  });

  return (
    <KeyboardProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </KeyboardProvider>
  );
}
