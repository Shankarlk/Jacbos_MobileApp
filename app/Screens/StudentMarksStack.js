import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StudentMarksListScreen from "./StudentMarksListScreen";
import FullStudentMarksListScreen from "./FullStudentMarksListScreen";

const Stack = createStackNavigator();

function StudentMarksStack({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="StudentMarksListScreen" component={StudentMarksListScreen} 
  options={{ title: "Test List" }} 
  initialParams={route.params}/>
      <Stack.Screen name="FullStudentMarksListScreen" component={FullStudentMarksListScreen}
  options={{ title: "Student Marks List" }}  />
    </Stack.Navigator>
  );
}

export default StudentMarksStack;
