import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AttendanceStandard from "./AttendanceStandard";
import ListOfStudentsScreen from "./ListOfStudentsScreen";

const Stack = createStackNavigator();

function AttendanceStack({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="AttendanceStandard" component={AttendanceStandard} 
  options={{ title: "Standard List" }} 
  initialParams={route.params}/>
      <Stack.Screen name="ListOfStudentsScreen" component={ListOfStudentsScreen}
  options={{ title: "Student List" }}  />
    </Stack.Navigator>
  );
}

export default AttendanceStack;
