import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationScreen from "../screens/RegistrationScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      {/* Add more screens/routes here if needed */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
