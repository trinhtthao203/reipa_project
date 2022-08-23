import * as React from "react";
import { View, Text } from "react-native";

import Strings from "@app/commons/strings"
import Constants from "@app/constants"
// import { SafeAreaProvider } from 'react-native-safe-area-context';
import RouteNavigation from "@app/navigation/routeNavigation";

const App = () => {
  // Strings.setLanguage(Constants.Language.VI);
  return (
    <View style={{ flex: 1 }}>
      <RouteNavigation />
    </View>
  );
};
export default App;
