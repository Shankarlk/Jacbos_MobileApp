import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StandardContentScreen from "./StandardContentScreen";
import SubjectContentScreen from "./SubjectContentScreen";
import MessageScreen from "./MessageScreen";

const Stack = createStackNavigator();

function SubjectStack({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="StandardContentScreen" component={StandardContentScreen} 
  options={{ title: "Standard List" }} 
  initialParams={route.params}/>
      <Stack.Screen name="SubjectContentScreen" component={SubjectContentScreen}
  options={{ title: "Student List" }}  />
      <Stack.Screen name="MessageScreen" component={MessageScreen}
  options={{ title: "Send Message To Student Parent" }}  />
    </Stack.Navigator>
  );
}

export default SubjectStack;
