import * as React from "react";
import { View, Text } from "react-native";

import Strings from "@app/commons/strings"
import Constants from "@app/constants"
// import { SafeAreaProvider } from 'react-native-safe-area-context';
import RouteNavigation from "@app/navigation/routeNavigation";

import { Provider } from 'react-redux';
import { store } from './app/store';

const App = () => {
  // Strings.setLanguage(Constants.Language.VI);
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <RouteNavigation />
      </View>
    </Provider>

  );
};
export default App;
