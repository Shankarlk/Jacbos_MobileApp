import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./app/Screens/LoginScreen";
import MainApp from "./app/Screens/MainApp";
import GeneratedQuestions from "./app/Screens/GeneratedQuestions";
import UpdateStudentScoresScreen from "./app/Screens/UpdateStudentScoresScreen";
import ListCourseConScreen from "./app/Screens/ListCourseConScreen";
import FileViewerScreen from "./app/Screens/FileViewerScreen";
import StListOfStudentsScreen from "./app/Screens/StListOfStudentsScreen";
import MessageScreen from "./app/Screens/MessageScreen";
import ListOfStudentsScreen from "./app/Screens/ListOfStudentsScreen";
import MainStudentApp from "./app/Screens/MainStudentApp";
import ResultScreen from "./app/Screens/ResultScreen";
import ListOfFilesScreen from "./app/Screens/ListOfFilesScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainApp" component={MainApp} />
        <Stack.Screen name="GeneratedQuestions" component={GeneratedQuestions} />
        <Stack.Screen name="UpdateStudentScoresScreen" component={UpdateStudentScoresScreen} />
        <Stack.Screen name="ListCourseConScreen" component={ListCourseConScreen} />
        <Stack.Screen name="FileViewerScreen" component={FileViewerScreen} />
        <Stack.Screen name="StListOfStudentsScreen" component={StListOfStudentsScreen} />
        <Stack.Screen name="MessageScreen" component={MessageScreen} />
        <Stack.Screen name="ListOfStudentsScreen" component={ListOfStudentsScreen} />
        <Stack.Screen name="MainStudentApp" component={MainStudentApp} /> 
        <Stack.Screen name="ResultScreen" component={ResultScreen} /> 
        <Stack.Screen name="ListOfFilesScreen" component={ListOfFilesScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
