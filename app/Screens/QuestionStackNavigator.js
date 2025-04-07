import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import QuestionScreen from "./QunestionScreen";
import GeneratedQuestionsScreen from "./GeneratedQuestions";

const Stack = createStackNavigator();

export default function QuestionStackNavigator({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="QuestionScreen" component={QuestionScreen}
  options={{ title: "Auto Generate Questions" }} 
  initialParams={route.params}/>
      <Stack.Screen name="GeneratedQuestions" component={GeneratedQuestionsScreen}
  options={{ title: "Generated Questions" }} />
    </Stack.Navigator>
  );
}
