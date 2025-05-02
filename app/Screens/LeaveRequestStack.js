import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LeaveListScreen from "./LeaveListScreen";
import LeaveManagementScreen from "./LeaveManagementScreen";
import EditLeaveRequestScreen from "./EditLeaveRequestScreen";

const Stack = createStackNavigator();

function LeaveRequestStack({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="LeaveListScreen" component={LeaveListScreen} 
  options={{ title: "Leave Request List" }} 
  initialParams={route.params}/>
      <Stack.Screen name="LeaveManagementScreen" component={LeaveManagementScreen}
  options={{ title: "Send Leave Request" }}  />
      <Stack.Screen name="EditLeaveRequestScreen" component={EditLeaveRequestScreen}
  options={{ title: "Edit Leave Request" }}  />
    </Stack.Navigator>
  );
}

export default LeaveRequestStack;