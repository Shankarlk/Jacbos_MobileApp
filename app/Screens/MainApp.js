import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity,Alert } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import DashboardScreen from "./DashboardScreen";
import SubjectStackNavigator from "./SubjectStackNavigator";
import ManualQuestionScreen from "./ManualQuestionScreen";
import UpdateStudentMarks from "./UpdateStudentMarksScreen";
import StudentScoreStack from "./StudentScoreStack";
import StudentMarksStack from "./StudentMarksStack";
import StandardMessageStack from "./StandardMessageStack";
import AttendanceStack from "./AttendanceStack";
import StudentLeaveManagementTeacher from "./StudentLeaveManagementTeacher";
import LeaveListScreen from "./LeaveListScreen";
import LeaveRequestStack from "./LeaveRequestStack";
import QuestionStackNavigator from "./QuestionStackNavigator";
import OverallStudentAttendance from "./OverallStudentAttendance";
import ChangePasswordTeacher from "./ChangePasswordTeacher";
import UnitTestScreen from "./UnitTestScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import BASE_URL from "./apiConfig";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Top Section - Logo */}
      <View style={styles.header}>
        <Image source={require("../assets/dummy-school-logo.png")} style={styles.logo} />
        {/* <Text style={{ fontWeight: "bold" }}>Om National Public School, Ranebennur</Text> */}
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />

      {/* Bottom Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate("Login")
        }
      ]
    );
  }}
 style={styles.logoutButton}>
          <Icon name="sign-out" size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

function DrawerNavigator({ screenProps }) {
  const params = screenProps?.params || {};
  const isClassteacher = screenProps?.isClassteacher ;
    console.log("DrawerNavigator",isClassteacher);
    return (
      <Drawer.Navigator
        initialRouteName="Dashboard"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerActiveBackgroundColor: "#E3E3E3",
          drawerLabelStyle: { fontSize: 16 },
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={DashboardScreen}
          initialParams={params}
          options={{
            drawerIcon: ({ color }) => <Icon name="dashboard" size={20} color={color} />,
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
        <Drawer.Screen
          name="Leave Request"
          component={LeaveRequestStack}
          initialParams={{ ...params, isClassteacher: true }}
          options={{
            drawerIcon: ({ color }) => <Icon name="folder-open" size={20} color={color} />,
          }}
        />
  
        {/* Conditional class teacher screens */}
        {isClassteacher && (
          <>
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
                drawerIcon: ({ color }) => <Icon name="check-square-o" size={20} color={color} />,
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
          </>
        )}
  
        <Drawer.Screen
                name="Student Marks"
                component={StudentMarksStack}
                initialParams={params}
                options={{
                  drawerIcon: ({ color }) => <Icon name="bar-chart" size={20} color={color} />,
                }}
          />
          <Drawer.Screen
            name="Exam List"
            component={UnitTestScreen}
            initialParams={params}
            options={{
              drawerIcon: ({ color }) => <Icon name="list-alt" size={20} color={color} />,
            }}
          />
          <Drawer.Screen
            name="Student Score"
            component={StudentScoreStack}
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
          name="Send Message To Parents"
          component={StandardMessageStack}
          initialParams={params}
          options={{
            drawerIcon: ({ color }) => <Icon name="comments" size={20} color={color} />,
          }}
        />
      </Drawer.Navigator>
    );
  
}

export default function MainApp({ route }) {
    console.log("MainApp Received params:", route?.params);
    const { username, loggeduser } = route.params;
      const [student, setStudent] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const fetchStudentDetails = async () => {
        // const { username } = route.params;
        try {
          const response = await fetch(
            `${BASE_URL}/api/TimeTableApi/getallteacherstandard?userId=${username}`
          );
          const data = await response.json();
          const filteredData = data.filter(item => item.isClassTeacher === true);
          setStudent((filteredData.length === 0)?false:true);
          console.log('teacher data',filteredData);
          console.log('teacher data',student);
        } catch (error) {
          console.error("Error fetching teacher details:", error);
        } finally {
          setLoading(false);
        }
      };
        useEffect(() => {
          fetchStudentDetails();
        }, []);
        if (loading) return null; 
  return <DrawerNavigator     screenProps={{ params: route?.params,isClassteacher:student }}  />;
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
