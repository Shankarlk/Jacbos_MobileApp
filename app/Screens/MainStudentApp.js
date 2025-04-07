import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import StudentDashboardScreen from "./StudentDashboardScreen";
import SubjectStackNavigator from "./SubjectStackNavigator";
import ManualQuestionScreen from "./ManualQuestionScreen";
import UpdateStudentMarks from "./UpdateStudentMarksScreen";
import StandardMessageStack from "./StandardMessageStack";
import AttendanceStack from "./AttendanceStack";
import StudentLeaveManagementTeacher from "./StudentLeaveManagementTeacher";
import LeaveManagementScreen from "./LeaveManagementScreen";
import QuestionStackNavigator from "./QuestionStackNavigator";
import OverallStudentAttendance from "./OverallStudentAttendance";
import ChangePasswordTeacher from "./ChangePasswordTeacher";
import UnitTestScreen from "./UnitTestScreen";
import Icon from "react-native-vector-icons/FontAwesome";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Top Section - Logo */}
      <View style={styles.header}>
        <Image source={require("../assets/dummy-school-logo.png")} style={styles.logo} />
        <Text style={{ fontWeight: "bold" }}>Om National Public School, Ranebennur</Text>
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />

      {/* Bottom Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.logoutButton}>
          <Icon name="sign-out" size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

function DrawerNavigator({ screenProps }) {
    const params = screenProps?.params || {};
    console.log("DrawerNavigator",params);
  return (
    <Drawer.Navigator
      initialRouteName="StudentDashboardScreen"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: "#E3E3E3",
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={StudentDashboardScreen}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="dashboard" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Request For Leave"
        component={LeaveManagementScreen}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="folder-open" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Student Leave Management"
        component={StudentLeaveManagementTeacher}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="users" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Update Student Attendance"
        component={AttendanceStack}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="list-alt" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Overall Attendance"
        component={OverallStudentAttendance}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="globe" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Send Message To Parents"
        component={StandardMessageStack}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="comments" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Test List"
        component={UnitTestScreen}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="list-alt" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Update Student Marks"
        component={UpdateStudentMarks}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="graduation-cap" size={20} color={color} />,
        }}
      />
     <Drawer.Screen 
        name="Auto Generate Question Paper"
        initialParams={params}
        component={QuestionStackNavigator}  
        options={{
            drawerIcon: ({ color }) => <Icon name="file-text" size={20} color={color} />,
        }}
        />
      <Drawer.Screen
        name="Generate Question Paper Manually"
        component={ManualQuestionScreen}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="pencil" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Change Password "
        component={ChangePasswordTeacher}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="lock" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
         name="Subject Content"
         component={SubjectStackNavigator} 
         initialParams={params}
         options={{
             drawerIcon: ({ color }) => <Icon name="book" size={20} color={color} />,
         }}
         />
    </Drawer.Navigator>
  );
}

export default function MainStudentApp({ route }) {
    console.log("MainApp Received params:", route?.params);
  return <DrawerNavigator     screenProps={{ params: route?.params }}  />;
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  userText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: "auto",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "red",
  },
});
