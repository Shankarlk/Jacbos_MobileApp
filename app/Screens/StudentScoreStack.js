import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UpdateStudentMarks from "./UpdateStudentMarksScreen";
import UpdateStudentScoresScreen from "./UpdateStudentScoresScreen";

const Stack = createStackNavigator();

function StudentScoreStack({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="UpdateStudentMarks" component={UpdateStudentMarks} 
  options={{ title: "Test List" }} 
  initialParams={route.params}/>
      <Stack.Screen name="UpdateStudentScoresScreen" component={UpdateStudentScoresScreen}
  options={{ title: "Update Marks" }}  />
    </Stack.Navigator>
  );
}

export default StudentScoreStack;
