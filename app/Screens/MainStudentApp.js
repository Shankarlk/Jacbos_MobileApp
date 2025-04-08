import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import StudentDashboardScreen from "./StudentDashboardScreen";
import GalleryStack from "./GalleryStack";
import LeaveManagementScreen from "./LeaveManagementScreen";
import PaymentScreen from "./PaymentScreen";
import TestResultStack from "./TestResultStack";
import HolidayEventListScreen from "./HolidayEventListScreen";
import ChangePasswordTeacher from "./ChangePasswordTeacher";
import StudentDetailsScreen from "./StudentDetailsScreen";
import Icon from "react-native-vector-icons/FontAwesome";

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
        component={StudentDashboardScreen}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="dashboard" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Test / Academic Result"
        component={TestResultStack}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="pencil" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Payment Details"
        component={PaymentScreen}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="money" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Request For Leave"
        component={LeaveManagementScreen}
        initialParams={{ ...params, isClassteacher: false }}
        options={{
          drawerIcon: ({ color }) => <Icon name="file-text-o" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Holiday / Event List"
        component={HolidayEventListScreen}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="calendar" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Gallery"
        component={GalleryStack}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="photo" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Student Details"
        component={StudentDetailsScreen}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="user" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Change Password"
        component={ChangePasswordTeacher}
        initialParams={params}
        options={{
          drawerIcon: ({ color }) => <Icon name="lock" size={20} color={color} />,
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
