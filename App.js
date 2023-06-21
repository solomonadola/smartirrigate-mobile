import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";

const App = () => {
  return (
    <NavigationContainer>
      <DashboardScreen />
    </NavigationContainer>
  );
};

export default App;
