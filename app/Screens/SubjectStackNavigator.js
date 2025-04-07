import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SubjectContentScreen from "./SubjectContentScreen";
import ListCourseConScreen from "./ListCourseConScreen";

const Stack = createStackNavigator();

function SubjectStackNavigator({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="SubjectContent" component={SubjectContentScreen} 
  options={{ title: "Subject List" }} 
  initialParams={route.params}/>
      <Stack.Screen name="ListCourseConScreen" component={ListCourseConScreen}
  options={{ title: "Subject Content List" }}  />
    </Stack.Navigator>
  );
}

export default SubjectStackNavigator;
