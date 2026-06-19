import "react-native-gesture-handler";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/Router";
import { persistor, store } from "./src/redux/Store";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={{ flex: 1 }}>
            <StatusBar barStyle={isDarkMode ? "dark-content" : "light-content"} />
            <AppNavigator />
          </View>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
export default App;
