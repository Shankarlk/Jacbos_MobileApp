import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TestResultScreen from "./TestResultScreen";
import ResultScreen from "./ResultScreen";

const Stack = createStackNavigator();

function TestResultStack({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="TestResultScreen" component={TestResultScreen} 
  options={{ title: "Tests List" }} 
  initialParams={route.params}/>
      <Stack.Screen name="ResultScreen" component={ResultScreen}
  options={{ title: "Result" }}  />
    </Stack.Navigator>
  );
}

export default TestResultStack;
