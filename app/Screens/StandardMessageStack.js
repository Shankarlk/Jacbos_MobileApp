import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StListOfStudentsScreen from "./StListOfStudentsScreen";
import StandardTeacherScreen from "./StandardTeacherScreen";
import MessageScreen from "./MessageScreen";

const Stack = createStackNavigator();

function StandardMessageStack({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="StandardTeacherScreen" component={StandardTeacherScreen} 
  options={{ title: "Standard List" }} 
  initialParams={route.params}/>
      <Stack.Screen name="StListOfStudentsScreen" component={StListOfStudentsScreen}
  options={{ title: "Student List" }}  />
      <Stack.Screen name="MessageScreen" component={MessageScreen}
  options={{ title: "Send Message To Student Parent" }}  />
    </Stack.Navigator>
  );
}

export default StandardMessageStack;
