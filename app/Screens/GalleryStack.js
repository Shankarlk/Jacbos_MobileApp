import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GalleryScreen from "./GalleryScreen";
import ListOfFilesScreen from "./ListOfFilesScreen";

const Stack = createStackNavigator();

function GalleryStack({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="GalleryScreen" component={GalleryScreen} 
  options={{ title: "Events" }} 
  initialParams={route.params}/>
      <Stack.Screen name="ListOfFilesScreen" component={ListOfFilesScreen}
  options={{ title: "Events Photos and Videos" }}  />
    </Stack.Navigator>
  );
}

export default GalleryStack;
